import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../ui/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-apple shadow-apple-sm hover:bg-primary/90 hover:scale-105 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground rounded-apple shadow-apple-sm hover:bg-destructive/90 hover:scale-105 active:scale-95",
        outline: "border border-border bg-background rounded-apple shadow-apple-sm hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        secondary: "bg-secondary text-secondary-foreground rounded-apple shadow-apple-sm hover:bg-secondary/80 hover:scale-105 active:scale-95",
        ghost: "rounded-apple hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        apple: "bg-primary text-primary-foreground rounded-apple shadow-apple-md hover:shadow-apple-lg hover:scale-102 active:scale-98 transition-apple",
        "apple-secondary": "bg-secondary text-secondary-foreground border border-border rounded-apple shadow-apple-sm hover:bg-secondary/80 hover:border-primary/30 hover:scale-102 active:scale-98 transition-apple",
        gradient: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-apple shadow-apple-lg hover:shadow-apple-xl hover:scale-105 active:scale-95 relative overflow-hidden",
        glass: "bg-background/80 backdrop-blur-xl border border-white/20 text-foreground rounded-apple shadow-apple-lg hover:bg-background/90 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        xl: "h-12 px-10 text-lg",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
        mobile: "h-11 px-4 min-w-[44px] text-base", // Apple's 44px minimum touch target
      },
      radius: {
        sm: "rounded-apple-sm",
        default: "rounded-apple",
        lg: "rounded-apple-lg",
        xl: "rounded-apple-xl",
        "2xl": "rounded-apple-2xl",
        "3xl": "rounded-apple-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // When asChild is true, we need to wrap everything in a single element
    // to satisfy React.Children.only requirement
    const content = (
      <>
        {/* Gradient shimmer effect for gradient variant */}
        {variant === "gradient" && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        )}
        
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="relative z-10">{leftIcon}</span>}
            <span className="relative z-10">{children}</span>
            {rightIcon && <span className="relative z-10">{rightIcon}</span>}
          </>
        )}
      </>
    )
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, radius, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? (
          <div className="contents">
            {content}
          </div>
        ) : (
          content
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
