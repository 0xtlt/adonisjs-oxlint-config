/**
 * Oxlint configuration types aligned with the Oxlint config file schema.
 * @see https://oxc.rs/docs/guide/usage/linter/config-file-reference
 */

export type Severity = 'off' | 'warn' | 'error' | 'allow' | 'deny'

export type RuleValue = Severity | [Severity, ...unknown[]]

export type RuleConfig = Record<string, RuleValue>

export type NativePlugin =
  | 'eslint'
  | 'react'
  | 'unicorn'
  | 'typescript'
  | 'oxc'
  | 'import'
  | 'jsdoc'
  | 'jest'
  | 'vitest'
  | 'jsx-a11y'
  | 'nextjs'
  | 'react-perf'
  | 'promise'
  | 'node'
  | 'vue'

export type CategorySeverity = Severity | 'off'

export interface RuleCategories {
  correctness?: CategorySeverity
  suspicious?: CategorySeverity
  pedantic?: CategorySeverity
  perf?: CategorySeverity
  style?: CategorySeverity
  restriction?: CategorySeverity
  nursery?: CategorySeverity
}

export type GlobalValue = 'readonly' | 'readable' | 'writable' | 'writeable' | 'off' | boolean

export interface JsPluginAlias {
  name: string
  specifier: string
}

export type JsPlugin = string | JsPluginAlias

export interface OxlintOverride {
  files?: string[]
  excludeFiles?: string[]
  env?: Record<string, boolean>
  globals?: Record<string, GlobalValue>
  plugins?: NativePlugin[]
  jsPlugins?: JsPlugin[]
  rules?: RuleConfig
}

export interface OxlintOptions {
  denyWarnings?: boolean
  maxWarnings?: number
  reportUnusedDisableDirectives?: Severity | number
  respectEslintDisableDirectives?: boolean
  typeAware?: boolean
  typeCheck?: boolean
}

export interface OxlintConfig {
  $schema?: string
  categories?: RuleCategories
  env?: Record<string, boolean>
  extends?: OxlintConfig[]
  globals?: Record<string, GlobalValue>
  ignorePatterns?: string[]
  jsPlugins?: JsPlugin[]
  options?: OxlintOptions
  overrides?: OxlintOverride[]
  plugins?: NativePlugin[]
  rules?: RuleConfig
  settings?: Record<string, unknown>
}

export type ConfigBlock = OxlintConfig | OxlintConfig[]
