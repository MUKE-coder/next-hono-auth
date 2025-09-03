"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string
  description?: string
  error?: string
  type?: string
  rows?: number
  required?: boolean
}

const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ label, description, error, type = "text", rows, required, className, ...props }, ref) => {
    const Component = type === "textarea" ? Textarea : Input

    return (
      <div className="space-y-2">
        <Label
          htmlFor={props.id}
          className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}
        >
          {label}
        </Label>
        {description && <p className="text-xs text-gray-600">{description}</p>}
        <Component
          ref={ref as any}
          type={type === "textarea" ? undefined : type}
          rows={type === "textarea" ? rows : undefined}
          className={cn("w-full", error && "border-red-500 focus:border-red-500 focus:ring-red-500", className)}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}
      </div>
    )
  },
)

InputField.displayName = "InputField"

export default InputField
