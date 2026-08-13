import type { OxfmtConfig } from './types'

/**
 * Oxfmt options mapped from `@adonisjs/prettier-config`.
 *
 * `prettier-edge` is not ported: Oxfmt does not support Prettier plugins.
 * Keep Prettier for `.edge` templates, or leave those files unformatted.
 */
export const OPTIONS = {
  trailingComma: 'es5',
  semi: false,
  singleQuote: true,
  useTabs: false,
  quoteProps: 'consistent',
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 100,
  tabWidth: 2,
  insertFinalNewline: true,
  endOfLine: 'lf',
  sortImports: false,
  sortPackageJson: false,
  ignorePatterns: ['**/*.edge', '**/*.edgejs'],
} as const satisfies OxfmtConfig
