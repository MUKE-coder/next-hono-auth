import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Wifi, ServerCrash } from "lucide-react";

interface TableErrorProps {
  title?: string;
  subtitle?: string;
  error?: Error | null;
  onRetry?: () => void;
  showRefreshPage?: boolean;
}

export default function TableError({
  title = "Failed to load data",
  subtitle = "Something went wrong while fetching the data",
  error,
  onRetry,
  showRefreshPage = true,
}: TableErrorProps) {
  const handleRefreshPage = () => {
    window.location.reload();
  };

  const getErrorIcon = () => {
    if (error?.message?.toLowerCase().includes("network")) {
      return <Wifi className="h-12 w-12 text-red-500" />;
    }
    if (error?.message?.toLowerCase().includes("server")) {
      return <ServerCrash className="h-12 w-12 text-red-500" />;
    }
    return <AlertCircle className="h-12 w-12 text-red-500" />;
  };

  const getErrorMessage = () => {
    if (!error) return "An unexpected error occurred";

    // Network errors
    if (
      error.message?.toLowerCase().includes("network") ||
      error.message?.toLowerCase().includes("fetch")
    ) {
      return "Network connection error. Please check your internet connection.";
    }

    // Server errors
    if (
      error.message?.toLowerCase().includes("500") ||
      error.message?.toLowerCase().includes("server")
    ) {
      return "Server error. Our team has been notified.";
    }

    // Authentication errors
    if (
      error.message?.toLowerCase().includes("401") ||
      error.message?.toLowerCase().includes("unauthorized")
    ) {
      return "Authentication error. Please log in again.";
    }

    // Permission errors
    if (
      error.message?.toLowerCase().includes("403") ||
      error.message?.toLowerCase().includes("forbidden")
    ) {
      return "Permission denied. You don't have access to this resource.";
    }

    // Not found errors
    if (
      error.message?.toLowerCase().includes("404") ||
      error.message?.toLowerCase().includes("not found")
    ) {
      return "The requested resource was not found.";
    }

    // Default to the original error message
    return error.message || "An unexpected error occurred";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Error Icon */}
          <div className="flex items-center justify-center">
            {getErrorIcon()}
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Oops! Something went wrong
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              {getErrorMessage()}
            </p>

            {/* Technical Error Details (collapsed by default) */}
            {error && process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {error.stack || error.message}
                  </pre>
                </div>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="flex items-center gap-2"
                variant="default"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}

            {showRefreshPage && (
              <Button
                onClick={handleRefreshPage}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>If this problem persists, please contact support.</p>
            <p>Error occurred at: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
