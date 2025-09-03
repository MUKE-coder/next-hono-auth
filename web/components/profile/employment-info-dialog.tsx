'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateUser } from '@/hooks/useUsers';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const employmentInfoSchema = z.object({
  title: z.string().optional(),
  employeeNo: z.string().optional(),
  computerNumber: z.string().optional(),
  presentSalary: z.number().min(0, 'Salary must be positive').optional(),
  category: z
    .enum(['PUBLIC_SERVICE', 'PRIVATE_SECTOR', 'SELF_EMPLOYED', 'UNEMPLOYED'])
    .optional(),
});

type EmploymentInfoFormData = z.infer<typeof employmentInfoSchema>;

interface EmploymentInfoDialogProps {
  user: any;
  onUpdate: (user: any) => void;
  children: React.ReactNode;
}

export function EmploymentInfoDialog({
  user,
  onUpdate,
  children,
}: EmploymentInfoDialogProps) {
  const updateUserMutation = useUpdateUser();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmploymentInfoFormData>({
    resolver: zodResolver(employmentInfoSchema),
    defaultValues: {
      title: user.profile?.title || '',
      employeeNo: user.profile?.employeeNo || '',
      computerNumber: user.profile?.computerNumber || '',
      presentSalary: user.profile?.presentSalary || undefined,
      category: user.profile?.category || undefined,
    },
  });

  // Get form state to check if fields are dirty
  const { formState } = form;
  const { isDirty, dirtyFields } = formState;

  // Reset form with current user data when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: user.profile?.title || '',
        employeeNo: user.profile?.employeeNo || '',
        computerNumber: user.profile?.computerNumber || '',
        presentSalary: user.profile?.presentSalary || '',
        category: user.profile?.category || '',
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: EmploymentInfoFormData) => {
    setIsLoading(true);

    const userId = user.id;

    try {
      // Create an object to hold only the changed values for the profile
      const changedProfileData: any = {};

      if (dirtyFields.title) changedProfileData.title = data.title;
      if (dirtyFields.employeeNo)
        changedProfileData.employeeNo = data.employeeNo;
      if (dirtyFields.computerNumber)
        changedProfileData.computerNumber = data.computerNumber;
      if (dirtyFields.presentSalary)
        changedProfileData.presentSalary = data.presentSalary;
      if (dirtyFields.category) changedProfileData.category = data.category;

      console.log('Dirty Fields:', changedProfileData);

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

      const newUser = { ...user };
      newUser.profile = { ...newUser.profile, ...changedProfileData };

      onUpdate(updatedUser);
      setOpen(false);
      toast.success('Membership information updated successfully!');
    } catch (error) {
      toast.error('Error; Failed to update employment information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Employment Information</DialogTitle>
          <DialogDescription>
            Update your employment details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="computerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Computer Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="presentSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Present Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? Number.parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC_SERVICE">
                        Public Service
                      </SelectItem>
                      <SelectItem value="PRIVATE_SECTOR">
                        Private Sector
                      </SelectItem>
                      <SelectItem value="RETIRED">Non Profit</SelectItem>
                      <SelectItem value="NON_PROFIT">Retired</SelectItem>
                      <SelectItem value="CLINICS">Clinics</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                disabled={isLoading}
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
