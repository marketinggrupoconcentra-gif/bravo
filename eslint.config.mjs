import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Temporary extraction directories (not application source):
    "temp-unzip/**",
    "temp-unzip-tablero/**",
    // E2E tests use Playwright typings:
    "tests/**",
    // Public and node_modules:
    "public/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;

