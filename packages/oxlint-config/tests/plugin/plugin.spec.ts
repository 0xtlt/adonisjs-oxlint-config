import { describe, expect, it } from 'vitest'

import plugin, {
  namingConvention,
  noForLoop,
  noUndefInit,
  preferAdonisjsInertiaForm,
  preferAdonisjsInertiaLink,
  preferLazyControllerImport,
  preferLazyListenerImport,
} from '../../src/plugin/index'

describe('plugin export', () => {
  it('registers every AdonisJS and compatibility rule under the @adonisjs name', () => {
    expect(plugin.meta.name).toBe('@adonisjs')
    expect(Object.keys(plugin.rules).sort()).toEqual(
      [
        'naming-convention',
        'no-backend-import-in-frontend',
        'no-for-loop',
        'no-undef-init',
        'prefer-adonisjs-inertia-form',
        'prefer-adonisjs-inertia-link',
        'prefer-lazy-controller-import',
        'prefer-lazy-listener-import',
      ].sort()
    )
  })

  it('exports individual rule modules', () => {
    expect(preferLazyControllerImport.meta.messages.preferLazyControllerImport).toBeTypeOf('string')
    expect(preferLazyListenerImport.meta.messages.preferLazyListenerImport).toBeTypeOf('string')
    expect(preferAdonisjsInertiaLink.meta.messages.preferAdonisInertiaLink).toBeTypeOf('string')
    expect(preferAdonisjsInertiaForm.meta.messages.preferAdonisInertiaForm).toBeTypeOf('string')
    expect(noUndefInit.meta.messages.unexpected).toBeTypeOf('string')
    expect(noForLoop.meta.messages.noForLoop).toBeTypeOf('string')
    expect(namingConvention.meta.messages.invalidName).toBeTypeOf('string')
  })
})
