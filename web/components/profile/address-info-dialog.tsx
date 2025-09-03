'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateUser } from '@/hooks/useUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const addressInfoSchema = z.object({
  homeAddress: z.string().optional(),
  workplaceAddress: z.string().optional(),
  district: z.string().optional(),
});

type AddressInfoFormData = z.infer<typeof addressInfoSchema>;

interface AddressInfoDialogProps {
  user: any;
  onUpdate: (user: any) => void;
  children: React.ReactNode;
}

export function AddressInfoDialog({
  user,
  onUpdate,
  children,
}: AddressInfoDialogProps) {
  const updateUserMutation = useUpdateUser();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressInfoFormData>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      homeAddress: user.profile?.homeAddress || '',
      workplaceAddress: user.profile?.workplaceAddress || '',
      district: user.profile?.district || '',
    },
  });
  // Get form state to check if fields are dirty
  const { formState } = form;
  const { isDirty, dirtyFields } = formState;

  // Reset form with current user data when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        homeAddress: user.profile?.homeAddress || '',
        workplaceAddress: user.profile?.workplaceAddress || '',
        district: user.profile?.district || '',
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: AddressInfoFormData) => {
    setIsLoading(true);

    const userId = user.id;

    try {
      // Create an object to hold only the changed values for the profile
      const changedProfileData: any = {};

      if (dirtyFields.homeAddress)
        changedProfileData.homeAddress = data.homeAddress;
      if (dirtyFields.workplaceAddress)
        changedProfileData.workplaceAddress = data.workplaceAddress;
      if (dirtyFields.district) changedProfileData.district = data.district;

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

      console.log('Data To Update ✅', updatedUser);

      await updateUserMutation.mutateAsync({ userId, data: updatedUser });

      onUpdate(updatedUser);
      setOpen(false);
      toast.success('Address information updated successfully!');
    } catch (error) {
      toast.error('Error; Failed to update address information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Address Information</DialogTitle>
          <DialogDescription>
            Update your address details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="homeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workplaceAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workplace Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
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
                disabled={isLoading || !isDirty}
                variant="outline"
                onClick={() => setOpen(false)}
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
