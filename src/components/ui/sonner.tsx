"use client";

import { useTheme } from "../ThemeProvider";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-text": "hsl(222.2 84% 4.9%)",
          "--normal-border": "hsl(214.3 31.8% 91.4%)",
          "--success-bg": "hsl(142.1 76.2% 94.3%)",
          "--success-text": "hsl(142.1 76.2% 6.3%)",
          "--success-border": "hsl(142.1 76.2% 84.3%)",
          "--error-bg": "hsl(0 84.2% 94.3%)",
          "--error-text": "hsl(0 84.2% 6.3%)",
          "--error-border": "hsl(0 84.2% 84.3%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: 'white',
          color: '#374151', // Gray text instead of black
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534', // Green text for success
            border: '1px solid #bbf7d0',
          },
        },
        error: {
          style: {
            background: '#fef2f2',
            color: '#dc2626', // Red text for errors
            border: '1px solid #fecaca',
          },
        },
        description: {
          style: {
            color: '#6b7280', // Lighter gray for description text
          },
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
