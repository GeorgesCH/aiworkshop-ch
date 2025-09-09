import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../ui/utils"

const headingVariants = cva(
  "font-display tracking-tight text-gray-900",
  {
    variants: {
      variant: {
        h1: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight",
        h2: "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight",
        h3: "text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug",
        h4: "text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug",
        h5: "text-lg sm:text-xl lg:text-2xl font-medium leading-normal",
        h6: "text-base sm:text-lg lg:text-xl font-medium leading-normal",
        display: "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight",
        hero: "text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight",
      },
      color: {
        default: "text-gray-900",
        muted: "text-gray-600",
        primary: "text-primary",
        secondary: "text-gray-600",
        gradient: "bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent",
        "gradient-primary": "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
      },
    },
    defaultVariants: {
      variant: "h1",
      color: "default",
    },
  }
)

const textVariants = cva(
  "text-gray-900",
  {
    variants: {
      variant: {
        body: "text-base leading-relaxed",
        "body-sm": "text-sm leading-relaxed",
        "body-lg": "text-lg leading-relaxed",
        lead: "text-xl leading-relaxed font-light",
        small: "text-sm leading-normal",
        caption: "text-xs leading-normal uppercase tracking-widest font-medium",
        muted: "text-sm text-gray-600 leading-normal",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },
    },
    defaultVariants: {
      variant: "body",
      align: "left",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, color, as, ...props }, ref) => {
    const Comp = as || (variant === "display" || variant === "hero" ? "h1" : variant || "h1")
    
    return (
      <Comp
        className={cn(headingVariants({ variant, color, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, align, as = "p", ...props }, ref) => {
    const Comp = as
    
    return (
      <Comp
        className={cn(textVariants({ variant, align, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

// Specialized Typography Components
const Hero = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Heading
      ref={ref}
      variant="hero"
      color="gradient"
      className={cn("max-w-4xl", className)}
      {...props}
    />
  )
)
Hero.displayName = "Hero"

const Lead = React.forwardRef<HTMLParagraphElement, Omit<TextProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      variant="lead"
      className={cn("text-gray-600 max-w-3xl", className)}
      {...props}
    />
  )
)
Lead.displayName = "Lead"

const Caption = React.forwardRef<HTMLParagraphElement, Omit<TextProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      variant="caption"
      className={cn("text-gray-600", className)}
      {...props}
    />
  )
)
Caption.displayName = "Caption"

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.QuoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      "mt-6 border-l-4 border-primary pl-6 text-lg italic text-gray-600 leading-relaxed",
      className
    )}
    {...props}
  />
))
Blockquote.displayName = "Blockquote"

const Code = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded-apple-sm bg-muted px-2 py-1 font-mono text-sm font-medium",
      className
    )}
    {...props}
  />
))
Code.displayName = "Code"

const Pre = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement>
>(({ className, ...props }, ref) => (
  <pre
    ref={ref}
    className={cn(
      "overflow-x-auto rounded-apple-lg bg-muted p-4 font-mono text-sm",
      className
    )}
    {...props}
  />
))
Pre.displayName = "Pre"

export {
  Heading,
  Text,
  Hero,
  Lead,
  Caption,
  Blockquote,
  Code,
  Pre,
  headingVariants,
  textVariants
}
