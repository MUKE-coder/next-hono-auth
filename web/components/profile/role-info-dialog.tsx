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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUser } from '@/hooks/useUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

const personalInfoSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER']).optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoDialogProps {
  user: any;
  onUpdate: (user: any) => void;
  children: React.ReactNode;
}

export function RoleInfoDialog({
  user,
  onUpdate,
  children,
}: PersonalInfoDialogProps) {
  const updateUserMutation = useUpdateUser();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      role: user.role || '',
    },
  });

  // Get form state to check if fields are dirty
  const { formState } = form;
  const { isDirty, dirtyFields } = formState;

  // Reset form with current user data when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        role: user.role || '',
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);

    const userId = user.id;

    try {
      // Create an object to hold only the changed values for the profile
      const changedProfileData: any = {};

      if (dirtyFields.role) changedProfileData.role = data.role;

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

      // console.log('Data To Update ✅', updatedUser);

      await updateUserMutation.mutateAsync({ userId, data: updatedUser });

      onUpdate(updatedUser);
      setOpen(false);
      toast.success('Role information updated successfully!');
    } catch (error) {
      toast.error('Error; Failed to update role information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Role Information</DialogTitle>
          <DialogDescription>
            Update user role details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="MEMBER">MEMBER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
