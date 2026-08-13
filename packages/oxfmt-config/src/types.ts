import type { Plugin } from 'prettier'

export type TrailingComma = 'all' | 'es5' | 'none'
export type QuoteProps = 'as-needed' | 'consistent' | 'preserve'
export type ArrowParens = 'always' | 'avoid'
export type EndOfLine = 'lf' | 'crlf' | 'cr'

export interface OxfmtConfig {
  printWidth?: number
  tabWidth?: number
  useTabs?: boolean
  semi?: boolean
  singleQuote?: boolean
  jsxSingleQuote?: boolean
  trailingComma?: TrailingComma
  quoteProps?: QuoteProps
  bracketSpacing?: boolean
  bracketSameLine?: boolean
  arrowParens?: ArrowParens
  endOfLine?: EndOfLine
  insertFinalNewline?: boolean
  sortImports?: boolean | Record<string, unknown>
  sortPackageJson?: boolean | Record<string, unknown>
  sortTailwindcss?: boolean | Record<string, unknown>
  ignorePatterns?: string[]
  overrides?: Array<{
    files: string[]
    excludeFiles?: string[]
    options?: Omit<OxfmtConfig, 'overrides'>
  }>
}

export type ConfigOverrides = Partial<OxfmtConfig>

export type EdgeAttributeQuotes = 'double' | 'single' | 'preserve'

export interface EdgePrettierOptions {
  parser?: 'edge' | string
  plugins?: Array<string | Plugin>
  filepath?: string
  trailingComma?: TrailingComma
  semi?: boolean
  singleQuote?: boolean
  useTabs?: boolean
  quoteProps?: QuoteProps
  bracketSpacing?: boolean
  arrowParens?: ArrowParens
  printWidth?: number
  tabWidth?: number
  endOfLine?: EndOfLine
  edgeMustacheSpacing?: number
  edgeAttributeQuotes?: EdgeAttributeQuotes
  edgeBlankLinesInBlocks?: number
}
