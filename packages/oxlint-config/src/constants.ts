import type { NativePlugin } from './types'

/**
 * Default list of files to include. Oxlint only lints JS/TS sources,
 * so this is used by overrides that should stay scoped to application code.
 */
export const INCLUDE_LIST = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'] as const

/**
 * Files and paths that must be ignored globally.
 */
export const GLOBAL_IGNORE_LIST = [
  'oxlint.config.js',
  'oxlint.config.ts',
  'oxlint.config.mts',
  'oxfmt.config.js',
  'oxfmt.config.ts',
  'oxfmt.config.mts',
  '.oxfmtrc.json',
  'vitest.config.ts',
  'tsup.config.ts',
  '*.min.*',
  '*.d.ts',
  'CHANGELOG.md',
  'dist/**',
  'LICENSE*',
  'output/**',
  'coverage/**',
  'temp/**',
  'build/**',
  '.yalc/**',
  'pnpm-lock.yaml',
  'yarn.lock',
  'package-lock.json',
] as const

/**
 * AdonisJS application paths that should not be linted.
 */
export const ADONIS_IGNORE_LIST = [
  'public/assets/**',
  '__snapshots__/**',
  'resources/**',
  '.adonisjs/**',
] as const

/**
 * Native Oxlint plugins enabled by the base presets.
 */
export const PLUGINS_LIST = [
  'eslint',
  'typescript',
  'unicorn',
  'oxc',
  'node',
] as const satisfies NativePlugin[]

/**
 * Categories are disabled so only the explicit AdonisJS rule list is active.
 * Oxlint otherwise turns `correctness` on by default, which would enable
 * extra rules that this AdonisJS preset does not ship.
 */
export const DISABLED_CATEGORIES = {
  correctness: 'off',
  suspicious: 'off',
  pedantic: 'off',
  perf: 'off',
  style: 'off',
  restriction: 'off',
  nursery: 'off',
} as const

export const VUE_FILES = [
  'resources/js/**/*.{ts,vue}',
  'inertia/**/*.{ts,vue}',
  '**/*.vue',
] as const

export const REACT_FILES = ['resources/js/**/*.{ts,tsx}', 'inertia/**/*.{ts,tsx}'] as const

export const INERTIA_FILES = ['inertia/**/*.{ts,tsx,vue,svelte}'] as const
