import { FlatCompat } from '@eslint/eslintrc';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import path from 'path';
import { fileURLToPath } from 'url';

// Untuk kompatibilitas dengan konfigurasi format lama
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Definisikan konfigurasi ESLint
const eslintConfig = [
  // Konfigurasi umum untuk semua file
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'public/**'],
  },

  // Next.js config
  ...compat.config({ extends: ['next/core-web-vitals'] }),

  // TypeScript plugin rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Unused imports plugin
  {
    plugins: {
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Simple import sort plugin
  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },

  // React hooks rules
  {
    rules: {
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];

export default eslintConfig;
