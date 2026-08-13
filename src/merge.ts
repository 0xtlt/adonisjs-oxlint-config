import type { ConfigBlock, JsPlugin, NativePlugin, OxlintConfig, OxlintOverride, RuleConfig } from './types'

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

function isPluginAlias(plugin: JsPlugin): plugin is { name: string; specifier: string } {
  return typeof plugin === 'object' && plugin !== null && 'specifier' in plugin
}

function jsPluginKey(plugin: JsPlugin): string {
  return isPluginAlias(plugin) ? `${plugin.name}::${plugin.specifier}` : plugin
}

function mergeJsPlugins(base: JsPlugin[] = [], extra: JsPlugin[] = []): JsPlugin[] {
  const seen = new Set<string>()
  const merged: JsPlugin[] = []

  for (const plugin of [...base, ...extra]) {
    const key = jsPluginKey(plugin)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    merged.push(plugin)
  }

  return merged
}

function mergePlugins(base?: NativePlugin[], extra?: NativePlugin[]): NativePlugin[] | undefined {
  if (!base && !extra) {
    return undefined
  }

  return unique([...(base ?? []), ...(extra ?? [])])
}

function mergeRules(base: RuleConfig = {}, extra: RuleConfig = {}): RuleConfig {
  return { ...base, ...extra }
}

function mergeOverrides(base: OxlintOverride[] = [], extra: OxlintOverride[] = []): OxlintOverride[] {
  return [...base, ...extra]
}

/**
 * Merge Oxlint config objects. Later blocks override earlier ones for the same
 * rule, category, env, global, setting, and option keys. Plugins, ignore
 * patterns, JS plugins, and overrides are concatenated.
 */
export function mergeConfig(base: OxlintConfig, extra: OxlintConfig): OxlintConfig {
  const merged: OxlintConfig = {
    ...base,
    ...extra,
    categories: { ...base.categories, ...extra.categories },
    env: { ...base.env, ...extra.env },
    globals: { ...base.globals, ...extra.globals },
    settings: { ...base.settings, ...extra.settings },
    options: { ...base.options, ...extra.options },
    rules: mergeRules(base.rules, extra.rules),
    ignorePatterns: unique([...(base.ignorePatterns ?? []), ...(extra.ignorePatterns ?? [])]),
    overrides: mergeOverrides(base.overrides, extra.overrides),
    jsPlugins: mergeJsPlugins(base.jsPlugins, extra.jsPlugins),
    plugins: mergePlugins(base.plugins, extra.plugins),
  }

  if (base.extends || extra.extends) {
    merged.extends = [...(base.extends ?? []), ...(extra.extends ?? [])]
  }

  if (merged.ignorePatterns?.length === 0) {
    delete merged.ignorePatterns
  }
  if (merged.overrides?.length === 0) {
    delete merged.overrides
  }
  if (merged.jsPlugins?.length === 0) {
    delete merged.jsPlugins
  }
  if (merged.plugins?.length === 0) {
    delete merged.plugins
  }
  if (merged.extends && merged.extends.length === 0) {
    delete merged.extends
  }
  if (merged.categories && Object.keys(merged.categories).length === 0) {
    delete merged.categories
  }
  if (merged.env && Object.keys(merged.env).length === 0) {
    delete merged.env
  }
  if (merged.globals && Object.keys(merged.globals).length === 0) {
    delete merged.globals
  }
  if (merged.settings && Object.keys(merged.settings).length === 0) {
    delete merged.settings
  }
  if (merged.options && Object.keys(merged.options).length === 0) {
    delete merged.options
  }
  if (merged.rules && Object.keys(merged.rules).length === 0) {
    delete merged.rules
  }

  return merged
}

export function flattenConfigBlocks(blocks: ConfigBlock[]): OxlintConfig[] {
  return blocks.flatMap((block) => (Array.isArray(block) ? block : [block]))
}

export function mergeConfigs(base: OxlintConfig, ...blocks: ConfigBlock[]): OxlintConfig {
  return flattenConfigBlocks(blocks).reduce(mergeConfig, base)
}
