'use client';

import { resetPassword } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  code: z
    .string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits'),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    // Optional strength rules (uncomment the ones you want)
    // .regex(/[A-Z]/, "Must include an uppercase letter")
    // .regex(/[a-z]/, "Must include a lowercase letter")
    // .regex(/[0-9]/, "Must include a number")
    // .regex(/[^A-Za-z0-9]/, "Must include a symbol")
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function page() {
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

  if (!token) {
    return notFound();
  }

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange', // validate as user types
    reValidateMode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onResetPassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const token: string | null = searchParams.get('token');
      const password = data.password;
      const confirmPassword = data.confirmPassword;

      const res = await resetPassword(
        token as string,
        password,
        confirmPassword
      );

      if (res.success) {
        toast.success('Password reset successfully');
        router.push('/auth/login');
      } else {
        toast.error(res.error || 'Failed to reset password');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => router.push('/auth/login');

  return (
    <section className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #e7000b
    
     100%)
          `,
          backgroundSize: '100% 100%',
        }}
      />
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Enter your new password below
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onResetPassword)}
                  className="space-y-4"
                >
                  <fieldset disabled={isLoading} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              New password
                            </FormLabel>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                aria-invalid={
                                  !!passwordForm.formState.errors.password
                                }
                                className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg pr-16 sm:pr-20 transition-colors duration-200 text-sm"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                                ) : (
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Confirm password
                            </FormLabel>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                aria-invalid={
                                  !!passwordForm.formState.errors
                                    .confirmPassword
                                }
                                className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500 rounded-lg pr-16 sm:pr-20 transition-colors duration-200 text-sm"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                                ) : (
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !passwordForm.formState.isValid}
                    >
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </fieldset>
                </form>
              </Form>

              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
