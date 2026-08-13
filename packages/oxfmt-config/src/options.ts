import type { OxfmtConfig } from './types'

/**
 * Oxfmt options for AdonisJS packages and applications.
 *
 * `.edge` files are ignored here and formatted by the bundled Edge printer
 * (`formatEdge()` / `adonisjs-oxfmt-edge`).
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
