# AI Workshop Font Configuration

## Overview
This document outlines the optimized font configuration for the AI Workshop website, using the custom Sigum font with best practices for performance and accessibility.

## Font Stack

### Primary Font: Sigum
- **Family**: `Sigum`
- **Weights**: 400 (normal), 600 (semibold), 700 (bold)
- **Formats**: WOFF2, WOFF, TTF
- **Usage**: Headers, branding, logo text

### Fallback Stack
```css
font-family: 'Sigum', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', sans-serif;
```

## Configuration Files

### 1. CSS Font Declarations (`src/index.css`)
```css
@font-face {
  font-family: 'Sigum';
  src: url('/fonts/sigum/Sigum.woff2') format('woff2'),
       url('/fonts/sigum/Sigum.woff') format('woff'),
       url('/fonts/sigum/Sigum.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 2. Tailwind Configuration (`tailwind.config.mjs`)
```javascript
fontFamily: {
  sigum: ['Sigum', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
  aiworkshop: ['Sigum', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
  display: ['Sigum', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
}
```

### 3. Font Loading Utility (`src/utils/font-loader.ts`)
- Optimized font loading with FontFace API
- Fallback handling for unsupported browsers
- Performance monitoring and timeout handling

## Usage

### Tailwind Classes
```html
<!-- Primary usage -->
<span class="font-sigum">AI-Workshop</span>

<!-- Legacy compatibility -->
<span class="font-aiworkshop">AI-Workshop</span>

<!-- Display text -->
<h1 class="font-display">Main Heading</h1>
```

### CSS Classes
```css
.fonts-loading {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.fonts-loaded {
  font-family: 'Sigum', 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}
```

## Performance Optimizations

### 1. Font Loading Strategy
- **Preloading**: Critical font weights preloaded in HTML
- **Font Display**: `swap` for better perceived performance
- **Progressive Enhancement**: Fallback fonts load immediately

### 2. Text Rendering
- **Optimize Legibility**: Better text rendering quality
- **Font Smoothing**: Antialiased rendering on all platforms
- **Font Features**: Kerning and ligatures enabled

### 3. Loading States
- **Loading Class**: Shows fallback fonts while loading
- **Loaded Class**: Switches to custom fonts when ready
- **Error Handling**: Graceful fallback on font load failure

## File Structure
```
public/fonts/sigum/
├── Sigum.woff2    # Primary format (best compression)
├── Sigum.woff     # Fallback format
├── Sigum.ttf      # Legacy fallback
└── Sigum.otf      # Source format (not used in web)
```

## Browser Support
- **Modern Browsers**: Full support with WOFF2
- **Legacy Browsers**: Fallback to WOFF/TTF
- **No Support**: Graceful degradation to system fonts

## Best Practices Implemented

1. **Font Display Swap**: Prevents invisible text during font load
2. **Preloading**: Critical fonts preloaded for faster rendering
3. **Progressive Enhancement**: App works without custom fonts
4. **Performance Monitoring**: Timeout and error handling
5. **Accessibility**: Maintains readability with fallbacks
6. **Consistent Naming**: Unified font family names across all configs

## Migration Notes

### From Previous Configuration
- Changed from `'aiworkshop_font'` to `'Sigum'` for consistency
- Added new `font-sigum` class alongside existing `font-aiworkshop`
- Implemented font loading optimization utilities
- Enhanced text rendering properties

### Backward Compatibility
- `font-aiworkshop` class still works (legacy support)
- All existing components continue to function
- Gradual migration to new `font-sigum` class recommended
