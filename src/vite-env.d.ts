/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key — see .env.example */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
