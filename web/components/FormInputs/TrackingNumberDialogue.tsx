"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRegistrationStore } from "@/store/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TrackingNumberForm() {
  const {
    resumeRegistration,
    isLoading,
    error: storeError,
  } = useRegistrationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(""); // local state for input
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  // Use store error if it exists, otherwise use local error
  const displayError = storeError || localError;

  const handleResume = async () => {
    // Clear any previous errors
    setLocalError(null);

    // Validate tracking number format
    if (!trackingNumber.trim() || trackingNumber.trim().length !== 8) {
      const errorMsg = "Please enter a valid 8-digit tracking number";
      setLocalError(errorMsg);
      toast.error("Invalid tracking number", {
        description: errorMsg,
      });
      return;
    }

    try {
      console.log("Resuming with tracking number:", trackingNumber);

      const result = await resumeRegistration(trackingNumber.trim());

      if (result) {
        const { profileId, nextStep } = result;
        // Navigate to the registration form with profileId and step
        router.push(`/auth/register/${profileId}?step=${nextStep}`);
        useRegistrationStore
          .getState()
          .setCompletedSteps(
            Array.from({ length: nextStep - 1 }, (_, i) => i + 1)
          );

        toast.success("Registration Resumed!", {
          description: `Welcome back! Continuing from step ${nextStep}.`,
        });

        // Close the dialog and clear the input
        setIsOpen(false);
        setTrackingNumber("");
        setLocalError(null);
      } else {
        // The resumeRegistration function will have set the store error
        // We can also set a local fallback error if needed
        if (!storeError) {
          setLocalError("Unable to resume registration. Please try again.");
        }

        toast.error("Resume Failed", {
          description:
            storeError ||
            "Tracking number not found. Please check and try again.",
        });
      }
    } catch (error) {
      console.error("Error resuming registration:", error);

      // Handle unexpected errors not caught by the store
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setLocalError(errorMsg);

      toast.error("Resume Failed", {
        description: errorMsg,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 8) {
      setTrackingNumber(value);
      // Clear errors when user starts typing
      if (localError) setLocalError(null);
      // Note: We don't clear store error here as it's managed by the store
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setTrackingNumber("");
    setLocalError(null);
    // Note: Store error will be cleared by the store when needed
  };

  const handleDialogOpen = () => {
    setIsOpen(true);
    // Clear any existing errors when opening the dialog
    setLocalError(null);
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            handleDialogOpen();
          } else {
            handleDialogClose();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            type="button"
            className="hover:bg-red-700 bg-transparent text-red-700 hover:text-white border-[1px] border-red-700"
          >
            Resume with Tracking Number
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Enter Tracking Number
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tracking-number">8-Digit Tracking Number</Label>
              <Input
                id="tracking-number"
                type="text"
                placeholder="12345678"
                value={trackingNumber}
                onChange={handleInputChange}
                className={`w-full ${displayError ? "border-red-500 focus:border-red-500" : ""}`}
                maxLength={8}
                autoComplete="off"
                disabled={isLoading}
              />
              {displayError && (
                <p className="text-sm text-red-500 mt-1">{displayError}</p>
              )}
              <p className="text-xs text-gray-500">
                Enter the 8-digit tracking number you received when you started
                registration.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleResume}
                className="bg-red-700 hover:bg-red-800 text-white disabled:opacity-50"
                disabled={
                  !trackingNumber.trim() ||
                  trackingNumber.length !== 8 ||
                  isLoading
                }
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resuming...</span>
                  </div>
                ) : (
                  "Resume"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
