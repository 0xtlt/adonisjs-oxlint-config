import type { OxfmtConfig } from './types'

/**
 * Oxfmt options mapped from `@adonisjs/prettier-config`.
 *
 * Oxfmt cannot load Prettier plugins, so `.edge` files are ignored here and
 * formatted by `prettier-edge` via `formatEdge()` / `adonisjs-oxfmt-edge`.
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
