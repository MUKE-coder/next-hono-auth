'use client';

import type React from 'react';

import { useState, useEffect } from 'react'; // Import useEffect
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // Assuming you want to use toast here too
import { useUpdateUser } from '@/hooks/useUsers';

const membershipInfoSchema = z.object({
  memberNumber: z.string().optional(),
  trackingNumber: z.string().optional(),
});

type MembershipInfoFormData = z.infer<typeof membershipInfoSchema>;

interface MembershipInfoDialogProps {
  user: any;
  onUpdate: (user: any) => void;
  children: React.ReactNode;
}

export function MembershipInfoDialog({
  user,
  onUpdate,
  children,
}: MembershipInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const updateUserMutation = useUpdateUser();

  const form = useForm<MembershipInfoFormData>({
    resolver: zodResolver(membershipInfoSchema),
    defaultValues: {
      memberNumber: user.profile?.memberNumber || '',
      trackingNumber: user.profile?.trackingNumber || '',
    },
  });

  // Get form state to check if fields are dirty
  const { formState } = form;
  const { isDirty, dirtyFields } = formState;

  // Reset form with current user data when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        memberNumber: user.profile?.memberNumber || '',
        trackingNumber: user.profile?.trackingNumber || '',
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: MembershipInfoFormData) => {
    setIsLoading(true);

    const userId = user.id;

    try {
      // Create an object to hold only the changed values for the profile
      const changedProfileData: any = {};

      if (dirtyFields.memberNumber)
        changedProfileData.memberNumber = data.memberNumber;
      if (dirtyFields.trackingNumber)
        changedProfileData.trackingNumber = data.trackingNumber;

      // If no fields are dirty, do not proceed
      if (Object.keys(changedProfileData).length === 0) {
        setOpen(false);
        return;
      }

      const updatedUser = {
        profile: {
          ...changedProfileData,
        },
      };

      await updateUserMutation.mutateAsync({ userId, data: updatedUser });

      // Update the local user object with the new values
      const newUser = { ...user };
      newUser.profile = { ...newUser.profile, ...changedProfileData };

      onUpdate(newUser); // Pass the updated user object back
      setOpen(false);
      toast.success('Membership information updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error; Failed to update membership information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Membership Information</DialogTitle>
          <DialogDescription>
            Update your membership details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                disabled={isLoading}
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset(); // Reset form state when dialog is closed by cancel
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !isDirty}>
                {isLoading ? (
                  <span className="flex gap-2 items-center">
                    <Loader2 className="animate-spin" /> Saving...
                  </span>
                ) : (
                  <>Save Changes</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
