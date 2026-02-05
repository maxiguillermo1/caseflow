import { defineConfig } from "eslint/config";

// Minimal ESLint setup for this repo (no extra plugins/deps).
export default defineConfig([
  {
    // Ignore build artifacts (including leftover Next.js output).
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {},
  },
]);
