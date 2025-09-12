/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // AI Workshop Design System - Tailwind Config
      colors: {
        // Brand Colors
        brand: {
          primary: '#dc143c',
          'primary-dark': '#b91c3c',
          secondary: '#f2f2f7',
          accent: '#ff1749',
          'accent-2': '#ff2d92',
        },
        
        // Semantic Colors - Aligned with existing CSS variables
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // Swiss Modern Palette
        swiss: {
          red: '#dc143c',
          'red-dark': '#b91c3c',
          gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          }
        },
        
        // Status Colors
        success: '#34c759',
        warning: '#ff9500',
        error: '#ff3b30',
        info: '#007aff',
        
        // Custom gradient colors for header
        'gradient-yellow': {
          start: 'rgb(255, 241, 113)',
          end: 'rgba(255, 241, 113, 0)',
        },
      },

      // Typography - Optimized font stack
      fontFamily: {
        // Primary sans-serif stack for body text (NO Sigum)
        sans: [
          'Inter', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display', 
          'Segoe UI', 
          'Roboto', 
          'sans-serif'
        ],
        // Custom Sigum font ONLY for branding elements
        sigum: [
          'Sigum', 
          'Inter', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display', 
          'sans-serif'
        ],
        // Display font for headings and titles
        display: [
          'Sigum', 
          'Inter', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display', 
          'sans-serif'
        ],
        // Legacy alias for backward compatibility (branding only)
        aiworkshop: [
          'Sigum', 
          'Inter', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display', 
          'sans-serif'
        ],
        // Monospace stack for code
        mono: [
          'SF Mono', 
          'Monaco', 
          'Cascadia Code', 
          'Roboto Mono', 
          'Consolas', 
          'Courier New', 
          'monospace'
        ],
      },
      
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '590', // Apple's specific medium weight
        semibold: '600',
        bold: '700',
      },

      fontSize: {
        'xs': ['11px', { lineHeight: '1.4' }],
        'sm': ['13px', { lineHeight: '1.4' }],
        'base': ['15px', { lineHeight: '1.4' }],
        'lg': ['17px', { lineHeight: '1.4' }],
        'xl': ['19px', { lineHeight: '1.3' }],
        '2xl': ['22px', { lineHeight: '1.3' }],
        '3xl': ['26px', { lineHeight: '1.2' }],
        '4xl': ['30px', { lineHeight: '1.2' }],
        '5xl': ['34px', { lineHeight: '1.1' }],
        '6xl': ['38px', { lineHeight: '1.1' }],
        '7xl': ['44px', { lineHeight: '1.1' }],
        '8xl': ['50px', { lineHeight: '1.1' }],
        '9xl': ['64px', { lineHeight: '1.1' }],
      },

      // Spacing - Apple-inspired 4px grid system
      spacing: {
        'apple-1': '4px',
        'apple-2': '8px',
        'apple-3': '12px',
        'apple-4': '16px',
        'apple-5': '20px',
        'apple-6': '24px',
        'apple-8': '32px',
        'apple-10': '40px',
        'apple-12': '48px',
        'apple-16': '64px',
        'apple-20': '80px',
        'apple-24': '96px',
        'apple-32': '128px',
      },

      // Border Radius
      borderRadius: {
        'apple-sm': '6px',
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
        'apple-2xl': '24px',
        'apple-3xl': '32px',
      },

      // Box Shadows - Apple-style elevation
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 16px 64px rgba(0, 0, 0, 0.15)',
        'apple-glow': '0 0 40px rgba(220, 20, 60, 0.15)',
        'apple-glow-lg': '0 0 60px rgba(220, 20, 60, 0.25)',
      },

      // Animation & Transitions
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'apple-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      transitionDuration: {
        'apple-fast': '200ms',
        'apple': '300ms',
        'apple-slow': '500ms',
      },

      // Animation keyframes
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(220, 20, 60, 0.4)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(220, 20, 60, 0)',
            opacity: '0.8'
          },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-4px) scale(1.02)' },
        },
      },

      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-up': 'scale-up 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
      },

      // Backdrop filters
      backdropBlur: {
        'apple': '20px',
        'apple-lg': '40px',
      },

      // Container sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },

      // Grid template columns
      gridTemplateColumns: {
        'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },

      // Aspect ratios
      aspectRatio: {
        'video': '16 / 9',
        'square': '1 / 1',
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'wide': '21 / 9',
      },
    },
  },
  plugins: [
    // Custom plugin for design system utilities
    function({ addUtilities, addComponents, theme }) {
      // Add design system utilities
      addUtilities({
        // Container utilities that match your existing system
        '.container-apple': {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          '@media (min-width: 480px)': { padding: '0 1.25rem' },
          '@media (min-width: 768px)': { padding: '0 1.5rem' },
        },

        // Section spacing utilities
        '.section-apple': {
          padding: '3rem 0',
          '@media (min-width: 480px)': { padding: '4rem 0' },
          '@media (min-width: 768px)': { padding: '5rem 0' },
        },

        // Glass effect utility
        '.glass-effect': {
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },

        // Header gradient utility
        '.header-gradient': {
          background: 'linear-gradient(-90deg, rgb(255, 241, 113) 10.28%, rgba(255, 241, 113, 0) 79.61%)',
        },

        // Apple spacing utilities
        '.py-apple-4': { paddingTop: '16px', paddingBottom: '16px' },
        '.px-apple-4': { paddingLeft: '16px', paddingRight: '16px' },
        '.px-apple-6': { paddingLeft: '24px', paddingRight: '24px' },
        '.py-apple-6': { paddingTop: '24px', paddingBottom: '24px' },
        '.py-apple-8': { paddingTop: '32px', paddingBottom: '32px' },
        '.py-apple-12': { paddingTop: '48px', paddingBottom: '48px' },
        '.py-apple-16': { paddingTop: '64px', paddingBottom: '64px' },
        '.gap-apple-3': { gap: '12px' },
        
        // Apple border radius utilities
        '.rounded-apple-sm': { borderRadius: '8px' },
        '.rounded-apple': { borderRadius: '12px' },
        '.rounded-apple-lg': { borderRadius: '16px' },
        '.rounded-apple-xl': { borderRadius: '20px' },
        '.rounded-apple-2xl': { borderRadius: '24px' },
        '.rounded-apple-3xl': { borderRadius: '32px' },
        
        // Apple shadow utilities
        '.shadow-apple-lg': { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' },
        
        // Apple transition utilities
        '.transition-apple': { transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
        
        // Font family utilities - Optimized and consistent
        '.font-sigum': { 
          fontFamily: 'Sigum, Inter, -apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },
        '.font-aiworkshop': { 
          fontFamily: 'Sigum, Inter, -apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },
        '.font-display': { 
          fontFamily: 'Sigum, Inter, -apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },

        '.dark .glass-effect': {
          backgroundColor: 'rgba(28, 28, 30, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },

        // Panel utilities
        '.panel-container': {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          '@media (min-width: 480px)': { padding: '2.5rem 1.25rem' },
          '@media (min-width: 768px)': { padding: '3rem 1.5rem' },
        },

        '.panel-block': {
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(4px) saturate(120%)',
        },

        '.dark .panel-block': {
          background: 'rgba(28, 28, 30, 0.55)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      });

      // Add component styles
      addComponents({
        '.btn-apple': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.apple'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none',
          '&:hover': {
            background: 'color-mix(in srgb, var(--primary) 90%, transparent)',
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },

        '.card-apple': {
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: theme('borderRadius.apple'),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
          },
        },

        '.input-apple': {
          background: 'var(--input-background)',
          border: '1px solid var(--border)',
          borderRadius: 'calc(var(--radius) - 2px)',
          padding: '12px 16px',
          fontSize: theme('fontSize.base')[0],
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:focus': {
            background: 'var(--background)',
            borderColor: 'var(--primary)',
            boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 10%, transparent)',
            outline: 'none',
          },
          '&::placeholder': {
            color: 'var(--muted-foreground)',
          },
        },
      });
    },
  ],
}
