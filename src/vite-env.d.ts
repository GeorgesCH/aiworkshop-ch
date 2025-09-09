/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADMIN_EMAIL?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allow importing assets via the custom figma alias used in vite.config.ts
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

// Global translation fallback function
declare global {
  interface Window {
    __TRANSLATION_FALLBACK__?: (key: string) => string;
  }
}

export {}

/* Asset modules are already covered by vite/client types. */
