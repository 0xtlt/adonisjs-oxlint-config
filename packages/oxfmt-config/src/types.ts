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
