/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 0 to 1. Set to 1 in .env.local to demo the error state. Unset in production. */
  readonly VITE_FAIL_RATE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
