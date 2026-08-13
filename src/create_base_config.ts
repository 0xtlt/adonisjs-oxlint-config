import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ADONIS_IGNORE_LIST,
  DISABLED_CATEGORIES,
  GLOBAL_IGNORE_LIST,
  PLUGINS_LIST,
} from './constants'
import { mergeConfigs } from './merge'
import { RULES_LIST } from './rules'
import type { ConfigBlock, JsPlugin, OxlintConfig } from './types'

/**
 * Resolve the compiled (or source) JS plugin path from any bundle entry.
 */
export function pluginSpecifier(from = import.meta.url): string {
  const dir = dirname(fileURLToPath(from))
  const candidates = [
    join(dir, 'plugin/index.js'),
    join(dir, '../plugin/index.js'),
    join(dir, '../dist/plugin/index.js'),
    join(dir, '../../dist/plugin/index.js'),
    join(dir, 'plugin/index.ts'),
    join(dir, '../plugin/index.ts'),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  throw new Error(`Unable to resolve the AdonisJS Oxlint plugin from ${dir}`)
}

export function adonisJsPlugin(): JsPlugin {
  return {
    name: '@adonisjs',
    specifier: pluginSpecifier(),
  }
}

export function createBaseConfig(rules: OxlintConfig['rules'] = RULES_LIST): OxlintConfig {
  return {
    plugins: [...PLUGINS_LIST],
    jsPlugins: [adonisJsPlugin()],
    categories: { ...DISABLED_CATEGORIES },
    ignorePatterns: [...GLOBAL_IGNORE_LIST, ...ADONIS_IGNORE_LIST],
    env: {
      es2024: true,
    },
    rules: { ...rules },
  }
}

export function applyConfigBlocks(base: OxlintConfig, blocks: ConfigBlock[]): OxlintConfig {
  return mergeConfigs(base, ...blocks)
}
