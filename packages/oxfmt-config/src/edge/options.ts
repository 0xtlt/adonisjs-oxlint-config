import { createRequire } from 'node:module'

import type { EdgePrettierOptions } from '../types'

const require = createRequire(import.meta.url)

/**
 * Shared AdonisJS Prettier options, used by `prettier-edge` for `.edge` files.
 * Oxfmt cannot load Prettier plugins, so Edge formatting stays on Prettier.
 */
export const EDGE_OPTIONS = {
  trailingComma: 'es5',
  semi: false,
  singleQuote: true,
  useTabs: false,
  quoteProps: 'consistent',
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 100,
  tabWidth: 2,
  endOfLine: 'lf',
} as const satisfies Omit<EdgePrettierOptions, 'parser' | 'plugins' | 'filepath'>

export const EDGE_EXTENSIONS = ['.edge', '.edgejs'] as const

export function prettierEdgePluginPath(): string {
  return require.resolve('prettier-edge')
}

/**
 * Prettier config matching `@adonisjs/prettier-config` for Edge templates.
 */
export function configEdge(overrides: EdgePrettierOptions = {}): EdgePrettierOptions {
  return {
    parser: 'edge',
    plugins: [prettierEdgePluginPath()],
    ...EDGE_OPTIONS,
    ...overrides,
  }
}
