import { existsSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { configPkg } from '../src/config_pkg'
import {
  ADONIS_IGNORE_LIST,
  DISABLED_CATEGORIES,
  GLOBAL_IGNORE_LIST,
  PLUGINS_LIST,
} from '../src/constants'
import { RULES_LIST } from '../src/rules'

describe('configPkg', () => {
  it('enables the native plugins used by the original AdonisJS preset', () => {
    expect(configPkg().plugins).toEqual([...PLUGINS_LIST])
  })

  it('disables Oxlint categories so only the explicit rule list is active', () => {
    expect(configPkg().categories).toEqual(DISABLED_CATEGORIES)
  })

  it('ignores the original global and AdonisJS ignore lists', () => {
    expect(configPkg().ignorePatterns).toEqual(
      expect.arrayContaining([...GLOBAL_IGNORE_LIST, ...ADONIS_IGNORE_LIST])
    )
  })

  it('maps TypeScript, Unicorn, and Node rules to native Oxlint names', () => {
    const rules = configPkg().rules ?? {}

    expect(rules).toMatchObject(RULES_LIST)
    expect(rules['typescript/consistent-type-imports']).toEqual([
      'error',
      { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
    ])
    expect(rules['unicorn/filename-case']).toEqual(['error', { case: 'snakeCase' }])
    expect(rules['node/handle-callback-err']).toEqual(['error', '^(err|error)$'])
    expect(rules['no-shadow']).toBe('error')
  })

  it('does not include formatter rules', () => {
    const rules = configPkg().rules ?? {}

    expect(rules['@stylistic/indent']).toBeUndefined()
  })

  it('points jsPlugins at a real AdonisJS plugin file', () => {
    const plugin = configPkg().jsPlugins?.[0]

    expect(plugin).toEqual(expect.objectContaining({ name: '@adonisjs' }))
    if (typeof plugin === 'object' && plugin !== null && 'specifier' in plugin) {
      expect(existsSync(plugin.specifier)).toBe(true)
    }
  })

  it('merges extra config blocks on top of the preset', () => {
    const config = configPkg({
      rules: { eqeqeq: 'off' },
      ignorePatterns: ['tmp/**'],
    })

    expect(config.rules?.eqeqeq).toBe('off')
    expect(config.ignorePatterns).toEqual(expect.arrayContaining(['tmp/**']))
  })

  it('does not enable AdonisJS app-only rules', () => {
    const rules = configPkg().rules ?? {}

    expect(rules['@adonisjs/prefer-lazy-controller-import']).toBeUndefined()
    expect(rules['@adonisjs/prefer-lazy-listener-import']).toBeUndefined()
  })
})
