import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  { ignores: ['node_modules/**', 'test-results/**', 'playwright-report/**', 'allure-*/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { console: 'readonly', process: 'readonly', structuredClone: 'readonly' },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs['recommended-type-checked'].rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
