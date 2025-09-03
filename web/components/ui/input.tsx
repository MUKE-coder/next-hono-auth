import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon: Icon,
      iconPosition = "left",
      iconClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex items-center w-full">
        {Icon && iconPosition === "left" && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            <Icon
              className={cn("h-5 w-5 text-muted-foreground", iconClassName)}
            />
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus:border-primary focus:border-2",
            "aria-invalid:border-destructive",
            Icon && iconPosition === "left" && "pl-10",
            Icon && iconPosition === "right" && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {Icon && iconPosition === "right" && (
          <div className="absolute right-3 flex items-center pointer-events-none">
            <Icon
              className={cn("h-5 w-5 text-muted-foreground", iconClassName)}
            />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
