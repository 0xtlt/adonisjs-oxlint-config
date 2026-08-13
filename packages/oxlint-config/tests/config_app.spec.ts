import { describe, expect, it } from 'vitest'

import { configApp, inertiaConfigBlock } from '../src/config_app'
import { APP_RULES_LIST, INERTIA_RULES_LIST } from '../src/rules'
import { mergeConfigs } from '../src/merge'

describe('configApp', () => {
  it('enables lazy controller and listener import rules', () => {
    expect(configApp().rules).toMatchObject(APP_RULES_LIST)
    expect(configApp().rules?.['@adonisjs/prefer-lazy-controller-import']).toBe('error')
    expect(configApp().rules?.['@adonisjs/prefer-lazy-listener-import']).toBe('error')
  })

  it('keeps inertia rules available as a dedicated override block', () => {
    expect(inertiaConfigBlock.overrides?.[0]?.files).toEqual(['inertia/**/*.{ts,tsx,vue,svelte}'])
    expect(inertiaConfigBlock.overrides?.[0]?.rules).toEqual(INERTIA_RULES_LIST)
  })

  it('can merge the inertia block when requested', () => {
    const config = mergeConfigs(configApp(), inertiaConfigBlock)
    const inertiaOverride = config.overrides?.find((override) =>
      override.files?.includes('inertia/**/*.{ts,tsx,vue,svelte}')
    )

    expect(inertiaOverride?.rules).toEqual(INERTIA_RULES_LIST)
  })

  it('accepts extra user config blocks', () => {
    const config = configApp({
      env: { node: true },
      rules: { 'no-debugger': 'off' },
    })

    expect(config.env?.node).toBe(true)
    expect(config.rules?.['no-debugger']).toBe('off')
  })
})
