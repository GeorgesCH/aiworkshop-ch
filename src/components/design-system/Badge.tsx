import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../ui/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-white shadow hover:bg-success/80",
        warning: "border-transparent bg-warning text-white shadow hover:bg-warning/80",
        info: "border-transparent bg-info text-white shadow hover:bg-info/80",
        apple: "border-transparent bg-primary text-primary-foreground rounded-apple-sm shadow-apple-sm hover:bg-primary/90",
        "apple-secondary": "border-transparent bg-secondary text-secondary-foreground rounded-apple-sm shadow-apple-sm hover:bg-secondary/80",
        gradient: "border-transparent bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-apple-sm",
        glass: "bg-background/80 backdrop-blur-xl border-white/20 text-foreground shadow-apple-sm",
        dot: "h-2 w-2 p-0 rounded-full",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

function Badge({ className, variant, size, leftIcon, rightIcon, removable, onRemove, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {leftIcon && <span className="mr-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1">{rightIcon}</span>}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
          type="button"
        >
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  )
}

// Status Badge - specialized component for status indicators
const StatusBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & {
    status: 'success' | 'warning' | 'error' | 'info' | 'pending'
  }
>(({ status, children, ...props }, ref) => {
  const statusConfig = {
    success: { variant: 'success' as const, icon: '✓' },
    warning: { variant: 'warning' as const, icon: '⚠' },
    error: { variant: 'destructive' as const, icon: '✕' },
    info: { variant: 'info' as const, icon: 'i' },
    pending: { variant: 'secondary' as const, icon: '⏳' },
  }
  
  const config = statusConfig[status]
  
  return (
    <Badge
      ref={ref}
      variant={config.variant}
      leftIcon={<span className="text-xs">{config.icon}</span>}
      {...props}
    >
      {children}
    </Badge>
  )
})
StatusBadge.displayName = "StatusBadge"

// Notification Badge - specialized component for notifications
const NotificationBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & {
    count?: number
    showZero?: boolean
    max?: number
  }
>(({ count = 0, showZero = false, max = 99, className, ...props }, ref) => {
  if (count === 0 && !showZero) return null
  
  const displayCount = count > max ? `${max}+` : count.toString()
  
  return (
    <Badge
      ref={ref}
      variant="destructive"
      size="sm"
      className={cn("absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center", className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
})
NotificationBadge.displayName = "NotificationBadge"

export { Badge, StatusBadge, NotificationBadge, badgeVariants }
