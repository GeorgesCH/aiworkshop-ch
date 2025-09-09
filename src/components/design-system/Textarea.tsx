import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../ui/utils"

const textareaVariants = cva(
  "flex min-h-[60px] w-full rounded-apple border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-apple-sm transition-apple placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white focus:border-primary focus:bg-white",
        apple: "bg-gray-100 border-gray-200 focus:bg-white focus:border-primary focus:shadow-[0_0_0_3px_rgba(220,20,60,0.1)]",
        outline: "border-2 border-primary/20 focus:border-primary",
        ghost: "border-transparent bg-transparent focus:border-gray-200 focus:bg-white",
      },
      textareaSize: {
        sm: "min-h-[50px] px-2 py-1 text-xs rounded-apple-sm",
        default: "min-h-[60px] px-3 py-2",
        lg: "min-h-[80px] px-4 py-3 text-base rounded-apple-lg",
        xl: "min-h-[100px] px-6 py-4 text-lg rounded-apple-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      textareaSize: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean
  helperText?: string
  label?: string
  maxLength?: number
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, textareaSize, error, helperText, label, id, maxLength, showCharCount, value, ...props }, ref) => {
    const textareaId = id || React.useId()
    const charCount = typeof value === 'string' ? value.length : 0
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              textareaVariants({ variant, textareaSize }),
              error && "border-destructive focus:border-destructive focus:ring-destructive",
              className
            )}
            ref={ref}
            maxLength={maxLength}
            value={value}
            {...props}
          />
          
          {error && (
            <div className="absolute right-3 top-3">
              <svg className="h-4 w-4 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {helperText && (
            <p className={cn(
              "text-sm",
              error ? "text-destructive" : "text-gray-600"
            )}>
              {helperText}
            </p>
          )}
          
          {showCharCount && maxLength && (
            <p className="text-sm text-gray-600 ml-auto">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
