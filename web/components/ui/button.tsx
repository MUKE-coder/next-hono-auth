import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
      focus: {
        default: "focus:border-primary focus:border-2",
        ring: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      focus: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loadingText?: string;
  href?: string;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      focus,
      asChild = false,
      icon: Icon,
      iconPosition = "left",
      isLoading = false,
      loadingText,
      href,
      children,
      ...props
    },
    ref
  ) => {
    // If href is provided, render as Link
    if (href) {
      // Extract only the properties that are valid for Link component
      const { rel, title, id, role, tabIndex, "aria-label": ariaLabel } = props;

      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, focus, className }))}
          rel={rel}
          title={title}
          id={id}
          role={role}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {loadingText || children}
            </>
          ) : (
            <>
              {Icon && iconPosition === "left" && <Icon className="size-4" />}
              {children}
              {Icon && iconPosition === "right" && <Icon className="size-4" />}
            </>
          )}
        </Link>
      );
    }

    // Otherwise render as button or slot
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, focus, className }))}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon className="size-4" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="size-4" />}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
