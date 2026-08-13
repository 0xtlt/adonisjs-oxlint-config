import { describe, expect, it } from 'vitest'

import { mergeConfig, mergeConfigs } from '../src/merge'
import type { OxlintConfig } from '../src/types'

describe('mergeConfig', () => {
  it('lets later rules override earlier rules', () => {
    const merged = mergeConfig(
      { rules: { eqeqeq: 'error', curly: 'error' } },
      { rules: { curly: 'off' } }
    )

    expect(merged.rules).toEqual({ eqeqeq: 'error', curly: 'off' })
  })

  it('unions plugins instead of replacing them', () => {
    const merged = mergeConfig({ plugins: ['eslint', 'typescript'] }, { plugins: ['vue'] })

    expect(merged.plugins).toEqual(['eslint', 'typescript', 'vue'])
  })

  it('concatenates ignore patterns without duplicates', () => {
    const merged = mergeConfig(
      { ignorePatterns: ['dist/**', 'build/**'] },
      { ignorePatterns: ['build/**', 'coverage/**'] }
    )

    expect(merged.ignorePatterns).toEqual(['dist/**', 'build/**', 'coverage/**'])
  })

  it('concatenates overrides in order', () => {
    const merged = mergeConfig(
      { overrides: [{ files: ['*.ts'], rules: { eqeqeq: 'error' } }] },
      { overrides: [{ files: ['*.tsx'], rules: { 'react/jsx-key': 'error' } }] }
    )

    expect(merged.overrides).toHaveLength(2)
    expect(merged.overrides?.[1]?.files).toEqual(['*.tsx'])
  })

  it('deduplicates jsPlugins by specifier', () => {
    const plugin = { name: '@adonisjs', specifier: '/tmp/plugin.js' }
    const merged = mergeConfig({ jsPlugins: [plugin] }, { jsPlugins: [plugin, './other.js'] })

    expect(merged.jsPlugins).toEqual([plugin, './other.js'])
  })

  it('merges settings objects', () => {
    const merged = mergeConfig(
      { settings: { react: { version: '18.0' } } },
      { settings: { react: { version: '19.0' } } }
    )

    expect(merged.settings).toEqual({ react: { version: '19.0' } })
  })
})

describe('mergeConfigs', () => {
  it('flattens nested config arrays', () => {
    const base: OxlintConfig = { rules: { eqeqeq: 'error' } }
    const first: OxlintConfig = { rules: { curly: 'error' } }
    const second: OxlintConfig = { rules: { 'no-debugger': 'error' } }

    const merged = mergeConfigs(base, first, [second])

    expect(merged.rules).toEqual({
      'eqeqeq': 'error',
      'curly': 'error',
      'no-debugger': 'error',
    })
  })
})
