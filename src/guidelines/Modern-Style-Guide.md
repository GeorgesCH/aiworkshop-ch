# Modern Style Guide for AI Workshop Website

This guide defines the modern, consistent styling approach used across the website, inspired by the CoachingPage design.

## Core Design Principles

### 1. Glass Morphism & Modern Cards
- **Background**: `bg-white/90 backdrop-blur-sm` for main cards
- **Borders**: `border border-border/60` for subtle, modern borders
- **Shadows**: `shadow-2xl` for depth and elevation
- **Rounded Corners**: `rounded-2xl` and `rounded-3xl` for modern feel

### 2. Gradient Effects
- **Text Gradients**: `bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent`
- **Background Gradients**: `bg-gradient-to-br from-primary/5 to-secondary/5`
- **Button Gradients**: `bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary`

### 3. Interactive Elements
- **Hover Effects**: `hover:scale-[1.02]` for subtle scaling
- **Transitions**: `transition-all duration-300` for smooth animations
- **Hover States**: `group-hover:opacity-100` for layered effects

## Component Patterns

### Cards
```tsx
<Card className="group relative overflow-hidden border border-border/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  <CardContent className="relative p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Buttons
```tsx
<button className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  <span className="relative z-10">Button Text</span>
</button>
```

### Icons in Cards
```tsx
<div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20">
  <IconComponent className="w-6 h-6 text-primary" />
</div>
```

### Headings
```tsx
<h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
    Heading Text
  </span>
</h2>
```

### Image Containers with Glow
```tsx
<div className="relative group">
  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
    <ImageWithFallback
      src={imageSrc}
      alt="Description"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
</div>
```

## Color System

### Primary Colors
- **Primary**: `#dc143c` (Swiss modern red)
- **Primary/90**: `#dc143c` with 90% opacity
- **Primary/70**: `#dc143c` with 70% opacity
- **Primary/20**: `#dc143c` with 20% opacity
- **Primary/10**: `#dc143c` with 10% opacity
- **Primary/5**: `#dc143c` with 5% opacity

### Background Colors
- **White/90**: `rgba(255, 255, 255, 0.9)` for main cards
- **White/80**: `rgba(255, 255, 255, 0.8)` for secondary cards
- **White/95**: `rgba(255, 255, 255, 0.95)` for headers

### Border Colors
- **Border/60**: `rgba(0, 0, 0, 0.08)` with 60% opacity
- **Border/40**: `rgba(0, 0, 0, 0.08)` with 40% opacity
- **Border/30**: `rgba(0, 0, 0, 0.08)` with 30% opacity

## Spacing & Layout

### Container Patterns
```tsx
<section className="py-20 lg:py-24">
  <div className="container mx-auto px-4">
    <div className="max-w-6xl mx-auto">
      {/* Content */}
    </div>
  </div>
</section>
```

### Grid Layouts
```tsx
<div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
  {/* Grid items */}
</div>
```

## Animation & Transitions

### Standard Transitions
- **Duration**: `duration-300` for most elements
- **Easing**: Default cubic-bezier for smooth feel
- **Hover Scale**: `hover:scale-[1.02]` for subtle lift
- **Transform**: `transition-transform duration-300` for smooth scaling

### Shimmer Effects
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
```

## Typography

### Headings
- **H1**: `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold`
- **H2**: `text-3xl lg:text-4xl font-bold`
- **H3**: `text-2xl font-semibold`

### Body Text
- **Large**: `text-lg lg:text-xl text-muted-foreground leading-relaxed`
- **Regular**: `text-base text-muted-foreground`
- **Small**: `text-sm text-muted-foreground`

## Background Handling

### Global Noise Background
- The website has a global noise background that should show through
- Sections should be transparent unless specifically using the dotted background
- Use `min-h-screen` instead of `bg-background` to maintain transparency

### Dotted Background (Hero Sections Only)
```tsx
{/* Hero dotted background pattern */}
<div className="absolute inset-0 opacity-30" style={{
  backgroundImage: "url('/hero-dots.png')",
  backgroundRepeat: 'repeat',
  backgroundPosition: '0 0',
  backgroundAttachment: 'fixed'
}} aria-hidden="true" />
```

### Section Backgrounds
- **Transparent sections**: No background (lets noise show through)
- **Card backgrounds**: `bg-white/90 backdrop-blur-sm` for glass effect
- **Accent areas**: Use cards with glass morphism instead of section backgrounds

## Implementation Guidelines

### 1. Always Use Modern Patterns
- Replace old Apple-style classes with modern glass morphism
- Use consistent border and shadow patterns
- Apply gradient effects for visual interest
- Remove hardcoded CSS and use Tailwind utilities only

### 2. Maintain Consistency
- Use the same card patterns across all components
- Apply consistent hover effects and transitions
- Follow the established color system
- Ensure transparent backgrounds unless using dotted pattern

### 3. Responsive Design
- Use responsive text sizing (`text-3xl lg:text-4xl`)
- Apply responsive spacing (`py-20 lg:py-24`)
- Use responsive grids (`grid lg:grid-cols-2`)
- Maintain aspect ratios with `aspect-[4/3]`

### 4. Accessibility
- Maintain proper contrast ratios
- Use semantic HTML elements
- Ensure keyboard navigation works
- Provide proper focus states

### 5. Background Best Practices
- Never use `bg-background` or solid backgrounds on sections
- Only use dotted background for hero sections
- Use glass morphism cards for content containment
- Let the global noise background show through

## Migration Checklist

When updating components to use modern styling:

- [ ] Replace old card classes with modern glass morphism
- [ ] Update buttons to use gradient styling
- [ ] Apply consistent border and shadow patterns
- [ ] Add hover effects and transitions
- [ ] Use gradient text for headings
- [ ] Update icon containers with modern styling
- [ ] Ensure responsive design patterns
- [ ] Test hover states and animations
- [ ] Verify accessibility compliance

## Examples

See the following components for reference implementations:
- `CoachingPage.tsx` - Full modern styling implementation
- `StatsSection.tsx` - Updated with modern patterns
- `WorkshopBookingPage.tsx` - Modern form styling
