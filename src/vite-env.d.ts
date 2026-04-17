/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly REACT_APP_SUPABASE_URL: string;
  readonly REACT_APP_SUPABASE_KEY: string;
  readonly REACT_APP_ADMIN_PASSCODE: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_KEY?: string;
  readonly VITE_ADMIN_PASSCODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
