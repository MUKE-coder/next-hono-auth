'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useTrackingData } from '@/hooks/useTracking';
import { Info, Loader2, XCircle } from 'lucide-react';

// Zod schema for form validation
const formSchema = z.object({
  applicationNumber: z.string().min(1, { message: 'Number is required.' }),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationStatus {
  id: string;
  status: string;
  lastUpdated: string;
  details: string;
}

const loadingMessages = [
  'Looking into the database...',
  'Finding your records...',
  'Found a match!',
  'Retrieving data...',
  'Almost there...',
];

const statusColorMap: Record<string, string> = {
  ACTIVE: 'text-green-600 bg-green-100',
  INACTIVE: 'text-gray-600 bg-gray-100',
  SUSPENDED: 'text-red-600 bg-red-100',
  PENDING: 'text-yellow-600 bg-yellow-100',
};

const alertStyleMap: Record<string, string> = {
  ACTIVE: 'border-green-500 text-green-700 dark:text-green-300',
  INACTIVE: 'border-gray-400 text-gray-700 dark:text-gray-400',
  SUSPENDED: 'border-red-500 text-red-700 dark:text-red-300',
  PENDING: 'border-yellow-500 text-yellow-700 dark:text-yellow-300',
};

export default function ApplicationStatusTracker() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'result'>('input');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationNumber: '',
    },
  });

  // Fetching data with a conditional refetch trigger
  const { data, error, refetch } = useTrackingData(
    currentStep === 'result' && trackingNumberInput ? trackingNumberInput : ''
  );

  // Dynamic details based on status
  const getStatusDetails = (status: string): string => {
    switch (status) {
      case 'ACTIVE':
        return `${data?.user?.name} Your application is active and approved. You can now proceed with the next steps.`;
      case 'INACTIVE':
        return `${data?.user?.name} Your application is inactive. This might be due to a prolonged period of no activity or a cancellation. Please contact support for more details.`;
      case 'SUSPENDED':
        return `${data?.user?.name} Your application has been suspended. This typically occurs due to a policy violation or an issue requiring immediate attention. Please contact us without delay.`;
      case 'PENDING':
        return `${data?.user?.name} Your application is currently being reviewed by our team. Please check back later for updates.`;
      default:
        return 'The status of your application is currently unknown. Please contact support for assistance.';
    }
  };

  // Unified effect for loading messages and data processing
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLoading) {
      let messageIndex = 0;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }, 1500);
    } else {
      clearInterval(interval);
      setLoadingMessage(''); // Clear message when not loading
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Effect to process fetched data or error
  useEffect(() => {
    if (!isLoading && trackingNumberInput && currentStep === 'result') {
      if (data && data?.trackingNumber) {
        const status = data?.user?.status ?? 'PENDING';
        setApplicationStatus({
          id: data?.trackingNumber,
          status: status,
          lastUpdated: new Date(data?.updatedAt).toLocaleDateString(),
          details: getStatusDetails(status), // Dynamic details
        });
        setFetchError(null); // Clear any previous errors
      } else if (error) {
        setFetchError(
          'An unexpected error occurred while retrieving your application status. Please try again later.'
        );
        setApplicationStatus(null); // Clear status on error
      } else if (!data?.trackingNumber) {
        // This case covers when data is received but trackingNumber is null/undefined
        setFetchError(
          'Application not found for the provided application number. Please check the number and try again.'
        );
        setApplicationStatus(null); // Clear status if not found
      }
    }
  }, [isLoading, data, error, trackingNumberInput, currentStep]);

  const resetAllStates = useCallback(() => {
    form.reset(); // Use react-hook-form's reset
    setApplicationStatus(null);
    setFetchError(null);
    setIsLoading(false);
    setLoadingMessage('');
    setTrackingNumberInput('');
    setCurrentStep('input');
  }, [form]);

  const onSubmit = async (values: FormData) => {
    setTrackingNumberInput(values.applicationNumber);
    setApplicationStatus(null);
    setFetchError(null);
    setIsLoading(true);

    // Simulate loading messages display
    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingMessage(loadingMessages[i]);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Final delay

    setIsLoading(false);
    setCurrentStep('result'); // Move to result step after loading
  };

  const renderStatusAlert = () => {
    if (applicationStatus) {
      return (
        <Alert
          className={
            alertStyleMap[applicationStatus.status] ??
            'border-gray-400 text-gray-700'
          }
        >
          <Info className="h-4 w-4" />
          <AlertTitle>Application Status Found!</AlertTitle>
          <AlertDescription>
            <p className="font-bold">
              Application Number: {applicationStatus.id}
            </p>
            <p className="font-bold">
              Application Status:{' '}
              <span
                className={`inline-block rounded px-2 py-1 font-semibold ${
                  statusColorMap[applicationStatus.status] ??
                  'text-gray-600 bg-gray-100'
                }`}
              >
                {applicationStatus.status}
              </span>
            </p>
            <p className="font-bold">
              Last Updated: {applicationStatus.lastUpdated}
            </p>
            <p className="mt-2 font-bold">{applicationStatus.details}</p>
          </AlertDescription>
        </Alert>
      );
    }

    if (fetchError) {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Card className="relative w-full max-w-lg overflow-hidden bg-background shadow-none">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 transition-opacity duration-300 dark:bg-gray-800/90">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-red-500" />
          <p className="animate-pulse px-4 text-center text-lg font-medium text-gray-700 dark:text-gray-200">
            {loadingMessage}
          </p>
        </div>
      )}

      <CardHeader className="border-b p-6 pb-4">
        <CardTitle className="text-center text-2xl font-bold">
          Track Status
        </CardTitle>
        <CardDescription className="text-center text-sm text-red-500">
          {currentStep === 'input' &&
            form.formState.errors.applicationNumber?.message}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                currentStep === 'input'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold">Application Number</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The Appl. ID No.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                currentStep === 'result'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Step
              </p>
            </div>
          </div>
        </div>

        {currentStep === 'result' ? (
          <div className="mt-4 grid gap-4">
            {renderStatusAlert()}
            <Button onClick={resetAllStates} className="w-full">
              Search Again
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="applicationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1 text-sm font-medium">
                      Application Number{' '}
                      <span className="text-xs font-normal text-red-500">
                        required
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your application Number"
                        {...field}
                        className={
                          form.formState.errors.applicationNumber
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="mt-6 w-full"
                type="submit"
                disabled={isLoading}
              >
                Send
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
