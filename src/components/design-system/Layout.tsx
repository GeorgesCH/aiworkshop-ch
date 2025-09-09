import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../ui/utils"

// Container Component
const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md", 
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        apple: "max-w-[1200px]",
        full: "max-w-full",
      },
      padding: {
        none: "px-0",
        sm: "px-4 sm:px-6",
        default: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
        apple: "px-4 sm:px-5 md:px-6",
      },
    },
    defaultVariants: {
      size: "apple",
      padding: "apple",
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padding, className }))}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

// Section Component
const sectionVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        none: "py-0",
        sm: "py-8 sm:py-12",
        default: "py-12 sm:py-16 md:py-20",
        lg: "py-16 sm:py-20 md:py-24",
        xl: "py-20 sm:py-24 md:py-32",
        apple: "py-12 sm:py-16 md:py-20", // Matches your section-apple
      },
      background: {
        none: "",
        muted: "bg-muted/30",
        card: "bg-white",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-gray-100 text-gray-600",
        gradient: "bg-gradient-to-br from-background via-background to-muted/20",
      },
    },
    defaultVariants: {
      spacing: "apple",
      background: "none",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "main" | "article" | "aside"
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, as = "section", ...props }, ref) => {
    const Comp = as
    
    return (
      <Comp
        ref={ref}
        className={cn(sectionVariants({ spacing, background, className }))}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

// Grid Component
const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        12: "grid-cols-12",
        "auto-fit": "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
        "auto-fill": "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
      },
      gap: {
        none: "gap-0",
        sm: "gap-3 sm:gap-4",
        default: "gap-4 sm:gap-6 lg:gap-8",
        lg: "gap-6 sm:gap-8 lg:gap-12",
        xl: "gap-8 sm:gap-12 lg:gap-16",
        apple: "gap-apple-4 sm:gap-apple-6 lg:gap-apple-8",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "apple",
    },
  }
)

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, className }))}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

// Flex Component
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      wrap: {
        nowrap: "flex-nowrap",
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2 sm:gap-3",
        default: "gap-3 sm:gap-4",
        lg: "gap-4 sm:gap-6",
        xl: "gap-6 sm:gap-8",
        apple: "gap-apple-3 sm:gap-apple-4",
      },
    },
    defaultVariants: {
      direction: "row",
      align: "center",
      justify: "start",
      wrap: "nowrap",
      gap: "apple",
    },
  }
)

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, align, justify, wrap, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(flexVariants({ direction, align, justify, wrap, gap, className }))}
        {...props}
      />
    )
  }
)
Flex.displayName = "Flex"

// Stack Component (Flex with column direction)
export interface StackProps extends Omit<FlexProps, 'direction'> {
  spacing?: VariantProps<typeof flexVariants>['gap']
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ spacing, gap, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="col"
        gap={spacing || gap}
        {...props}
      />
    )
  }
)
Stack.displayName = "Stack"

// Center Component
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          "items-center justify-center",
          className
        )}
        {...props}
      />
    )
  }
)
Center.displayName = "Center"

// Spacer Component
export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl" | "2xl"
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4",
      default: "h-8",
      lg: "h-12",
      xl: "h-16",
      "2xl": "h-24",
    }
    
    return (
      <div
        ref={ref}
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
Spacer.displayName = "Spacer"

// Panel Components (matching your existing panel system)
const PanelContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("panel-container", className)}
        {...props}
      />
    )
  }
)
PanelContainer.displayName = "PanelContainer"

const panelVariants = cva(
  "panel-block",
  {
    variants: {
      variant: {
        default: "",
        purple: "panel-block--purple",
        teal: "panel-block--teal", 
        cream: "panel-block--cream",
      },
      padding: {
        sm: "p-4 lg:p-6",
        default: "p-6 lg:p-8",
        lg: "p-8 lg:p-12",
        xl: "p-10 lg:p-16",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(panelVariants({ variant, padding, className }))}
        {...props}
      />
    )
  }
)
Panel.displayName = "Panel"

export {
  Container,
  Section, 
  Grid,
  Flex,
  Stack,
  Center,
  Spacer,
  PanelContainer,
  Panel,
  containerVariants,
  sectionVariants,
  gridVariants,
  flexVariants,
  panelVariants
}
