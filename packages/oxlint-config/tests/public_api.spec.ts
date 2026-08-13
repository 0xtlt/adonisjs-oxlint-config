import { describe, expect, it } from 'vitest'

import {
  ADONIS_IGNORE_LIST,
  APP_RULES_LIST,
  GLOBAL_IGNORE_LIST,
  INCLUDE_LIST,
  INERTIA_RULES_LIST,
  PLUGINS_LIST,
  REACT_RULES_LIST,
  RULES_LIST,
  VUE_RULES_LIST,
  configApp,
  configPkg,
  defineConfig,
  mergeConfig,
  mergeConfigs,
} from '../src/index'

describe('public API', () => {
  it('exports the original preset helpers and constants', () => {
    expect(typeof configPkg).toBe('function')
    expect(typeof configApp).toBe('function')
    expect(typeof defineConfig).toBe('function')
    expect(typeof mergeConfig).toBe('function')
    expect(typeof mergeConfigs).toBe('function')
    expect(INCLUDE_LIST.length).toBeGreaterThan(0)
    expect(GLOBAL_IGNORE_LIST.length).toBeGreaterThan(0)
    expect(ADONIS_IGNORE_LIST.length).toBeGreaterThan(0)
    expect(PLUGINS_LIST).toContain('typescript')
    expect(RULES_LIST.eqeqeq).toEqual(['error', 'always'])
    expect(APP_RULES_LIST['@adonisjs/prefer-lazy-controller-import']).toBe('error')
    expect(INERTIA_RULES_LIST['@adonisjs/prefer-adonisjs-inertia-link']).toBe('error')
    expect(VUE_RULES_LIST['vue/define-emits-declaration']).toEqual(['error', 'type-based'])
    expect(REACT_RULES_LIST['react/rules-of-hooks']).toBe('error')
  })

  it('returns the same object from defineConfig', () => {
    const input = { rules: { eqeqeq: 'error' as const } }
    expect(defineConfig(input)).toBe(input)
  })
})
