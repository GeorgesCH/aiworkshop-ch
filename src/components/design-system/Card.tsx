import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../ui/utils"

const cardVariants = cva(
  "rounded-apple border bg-card text-card-foreground shadow-apple-sm transition-apple",
  {
    variants: {
      variant: {
        default: "border-border",
        apple: "border-border hover:shadow-apple-lg hover:-translate-y-1 hover:border-primary/20",
        glass: "bg-background/80 backdrop-blur-xl border-white/20 shadow-apple-lg",
        elevated: "shadow-apple-md hover:shadow-apple-lg",
        outline: "border-2 border-primary/20 hover:border-primary/40",
        gradient: "bg-gradient-to-br from-card to-secondary/20 border-border/50",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
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
      padding: "default",
      radius: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, radius, hover = false, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, radius }),
          hover && "hover:shadow-apple-lg hover:-translate-y-1",
          interactive && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Feature Card - specialized component for features/services
const FeatureCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    icon?: React.ReactNode
    title?: string
    description?: string
    badge?: string
  }
>(({ className, icon, title, description, badge, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant="apple"
    className={cn("group", className)}
    {...props}
  >
    <CardContent className="p-8">
      <div className="space-y-4">
        {icon && (
          <div className="w-12 h-12 rounded-apple-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        )}
        
        <div className="space-y-2">
          {badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {badge}
            </span>
          )}
          
          {title && (
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {children}
      </div>
    </CardContent>
  </Card>
))
FeatureCard.displayName = "FeatureCard"

// Testimonial Card - specialized component for testimonials
const TestimonialCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    quote?: string
    author?: string
    role?: string
    company?: string
    avatar?: string
  }
>(({ className, quote, author, role, company, avatar, ...props }, ref) => (
  <Card
    ref={ref}
    variant="glass"
    className={cn("group", className)}
    {...props}
  >
    <CardContent className="p-8">
      <div className="space-y-6">
        {quote && (
          <blockquote className="text-lg leading-relaxed text-foreground">
            "{quote}"
          </blockquote>
        )}
        
        <div className="flex items-center space-x-4">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
              width="48"
              height="48"
            />
          )}
          
          <div>
            {author && (
              <div className="font-semibold text-foreground">{author}</div>
            )}
            {(role || company) && (
              <div className="text-sm text-muted-foreground">
                {role}{role && company && " at "}{company}
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
))
TestimonialCard.displayName = "TestimonialCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  FeatureCard,
  TestimonialCard,
  cardVariants 
}
