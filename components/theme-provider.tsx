// components/theme-provider.tsx
// @wrksz/themes/next ThemeProvider is an async Server Component.
// It cannot be wrapped in a "use client" boundary.
// Import it directly from layout.tsx — see app/layout.tsx.
//
// For client-side theme toggling, use:
//   import { useTheme } from "@wrksz/themes/client"
export { ThemeProvider } from "@wrksz/themes/next";