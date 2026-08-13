import { describe, expect, it } from 'vitest'

import { react } from '../src/frameworks/react'
import { vue } from '../src/frameworks/vue'
import { configApp } from '../src/config_app'
import { REACT_FILES, VUE_FILES } from '../src/constants'
import { REACT_RULES_LIST, VUE_RULES_LIST } from '../src/rules'

describe('vue preset', () => {
  it('enables the native vue plugin and AdonisJS vue rules', () => {
    expect(vue.plugins).toEqual(expect.arrayContaining(['vue']))
    expect(vue.overrides?.[0]?.files).toEqual([...VUE_FILES])
    expect(vue.overrides?.[0]?.rules).toMatchObject(VUE_RULES_LIST)
  })

  it('merges into configApp without dropping app rules', () => {
    const config = configApp(vue)

    expect(config.plugins).toEqual(expect.arrayContaining(['vue']))
    expect(config.rules?.['@adonisjs/prefer-lazy-controller-import']).toBe('error')
    expect(config.overrides?.some((override) => override.files?.includes('**/*.vue'))).toBe(true)
  })
})

describe('react preset', () => {
  it('enables the native react plugin, React 19 settings, and hooks rules', () => {
    expect(react.plugins).toEqual(expect.arrayContaining(['react']))
    expect(react.settings).toEqual({ react: { version: '19.0' } })
    expect(react.overrides?.[0]?.files).toEqual([...REACT_FILES])
    expect(react.overrides?.[0]?.rules).toMatchObject(REACT_RULES_LIST)
    expect(react.overrides?.[0]?.rules?.['react/react-in-jsx-scope']).toBe('off')
    expect(react.overrides?.[0]?.rules?.['react/rules-of-hooks']).toBe('error')
    expect(react.overrides?.[0]?.rules?.['react/exhaustive-deps']).toBe('warn')
  })

  it('merges into configApp', () => {
    const config = configApp(react)

    expect(config.plugins).toEqual(expect.arrayContaining(['react']))
    expect(config.settings).toEqual({ react: { version: '19.0' } })
  })
})
