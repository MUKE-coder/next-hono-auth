"use client"
import * as React from "react"
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

export interface SearchableSelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface SelectProps {
  options: SearchableSelectOption[]
  value?: SearchableSelectOption | null
  description?: string
  error?: string
  label: string
  required?: boolean
  isSearchable?: boolean
  onValueChange: any
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  loading?: boolean
  className?: string
  popoverClassName?: string
  clearable?: boolean
  showDescription?: boolean
  maxHeight?: string
}

export function SelectInput({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No Data found.",
  disabled = false,
  loading = false,
  label,
  description,
  error,
  required = false,
  isSearchable = true,
  className,
  popoverClassName,
  clearable = true,
  showDescription = true,
  maxHeight = "300px",
}: SelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: SearchableSelectOption) => {
    if (option.disabled) return
    onValueChange(option)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange(null)
  }

  return (
    <div className="space-y-2">
      <Label className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}>
        {label}
      </Label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between border border-gray-300 rounded-sm hover:text-gray-500 text-gray-500 hover:bg-transparent hover:border-purple-600 bg-transparent w-full",
              disabled && "opacity-50 cursor-not-allowed",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <span className="truncate">{value?.label || placeholder}</span>
            )}
            <div className="flex items-center gap-1">
              {clearable && value && !loading && (
                <X className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100" onClick={handleClear} />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[var(--radix-popover-trigger-width)] p-0 border border-gray-300 rounded-sm",
            popoverClassName,
          )}
        >
          <Command>
            {isSearchable ? <CommandInput placeholder={searchPlaceholder} className="border-none focus:ring-0" /> : ""}
            <CommandList style={{ maxHeight }}>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={cn("cursor-pointer", option.disabled && "opacity-50 cursor-not-allowed")}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value?.value === option.value ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="truncate">{option.label}</span>
                      {showDescription && option.description && (
                        <span className="text-sm text-muted-foreground truncate">{option.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}