import { approveMember, rejectMember } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function AcceptAndReject({ memberId }: { memberId: string }) {
  // Enhanced action handlers with proper error handling
  const handleApprove = async () => {
    try {
      toast.loading("Approving member...", { id: `approve-${memberId}` });
      await approveMember(memberId);
      // await refetchPending();
      toast.success("Member approved successfully!", {
        id: `approve-${memberId}`,
      });
    } catch (error) {
      console.error("Failed to approve member:", error);
      toast.error("Failed to approve member. Please try again.", {
        id: `approve-${memberId}`,
      });
    }
  };

  const handleReject = async () => {
    try {
      toast.loading("Rejecting member...", { id: `reject-${memberId}` });
      await rejectMember(memberId);
      // await refetchPending();
      toast.success("Member rejected successfully!", {
        id: `reject-${memberId}`,
      });
    } catch (error) {
      console.error("Failed to reject member:", error);
      toast.error("Failed to reject member. Please try again.", {
        id: `reject-${memberId}`,
      });
    }
  };
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        size="sm"
        onClick={() => handleApprove()}
        className="bg-green-600 hover:bg-green-700 text-white border-0 h-8 px-3"
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReject()}
        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-8 px-3"
      >
        <XCircle className="w-3 h-3 mr-1" />
        Reject
      </Button>
    </div>
  );
}
