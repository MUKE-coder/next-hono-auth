"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Upload, ImageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  endpoint?: any;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  className,
  endpoint = "imageUploader",
}: ImageUploadProps) {
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleRemove = () => {
    onChange("");
    setUploadComplete(false);
  };

  const handleUploadComplete = (res: any) => {
    console.log("Files: ", res);
    onChange(res[0].ufsUrl);
    setUploadComplete(true);
    setTimeout(() => setUploadComplete(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Image Preview */}
      {value && (
        <div className="relative group">
          <div className="relative w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
            <Image
              src={value}
              alt="Logo preview"
              fill
              className="object-cover"
              sizes="64px"
            />
            {/* Success indicator */}
            {uploadComplete && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 shadow-lg bg-red-500 hover:bg-red-600 text-white"
            onClick={handleRemove}
          >
            <X className="w-3 h-3 text-white" />
          </Button>
        </div>
      )}

      {/* Upload Section */}
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}

        <div className="flex items-center gap-3">
          {!value && (
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <UploadButton
              className={cn(
                // More specific and reliable button styling
                "[&>button]:bg-indigo-600 [&>button]:hover:bg-indigo-700",
                "[&>button]:text-white [&>button]:font-medium",
                "[&>button]:px-4 [&>button]:py-2 [&>button]:rounded-lg",
                "[&>button]:text-sm [&>button]:border-0",
                "[&>button]:transition-colors [&>button]:duration-200",
                "[&>button]:min-h-[36px] [&>button]:shadow-sm",
                "[&>button]:cursor-pointer",
                // Ensure text is visible
                "[&>button]:!text-white [&>button]:!bg-indigo-600",
                // Loading state
                "[&>button]:disabled:opacity-50 [&>button]:disabled:cursor-not-allowed",
                "[&>button]:disabled:bg-indigo-400",
                // Allowed content styles
                "[&>.ut-allowed-content]:text-xs [&>.ut-allowed-content]:text-gray-500 [&>.ut-allowed-content]:mt-1",
                // Alternative approach with direct styling
                "text-white"
              )}
              endpoint={endpoint}
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
              }}
              appearance={{
                button: {
                  backgroundColor: "oklch(54.1% 0.281 293.009)",
                  color: "white",
                  fontWeight: "500",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  border: "none",
                  minHeight: "15px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                },
                allowedContent: {
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "4px",
                },
              }}
              content={{
                button({ ready, isUploading }) {
                  if (isUploading)
                    return (
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-white">Uploading...</span>
                      </div>
                    );
                  if (ready)
                    return (
                      <div className="flex items-center gap-2 text-white">
                        <Upload className="w-4 h-4 text-white" />
                        <span className="text-white">
                          {value ? "Change" : "Upload"}
                        </span>
                      </div>
                    );
                  return <span className="text-white">Upload</span>;
                },
                allowedContent({ ready, isUploading }) {
                  if (!ready) return "Uploading...";
                  if (isUploading) return "Uploading...";
                  return "Max 1MB";
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
