import { describe, expect, it } from 'vitest'

import { OPTIONS, configOxfmt } from '../src/index'

describe('configOxfmt', () => {
  it('matches the original AdonisJS Prettier options', () => {
    expect(OPTIONS).toMatchObject({
      trailingComma: 'es5',
      semi: false,
      singleQuote: true,
      useTabs: false,
      quoteProps: 'consistent',
      bracketSpacing: true,
      arrowParens: 'always',
      printWidth: 100,
      tabWidth: 2,
      insertFinalNewline: true,
      endOfLine: 'lf',
    })
  })

  it('does not enable Oxfmt-only sorting that Prettier did not ship', () => {
    expect(OPTIONS.sortImports).toBe(false)
    expect(OPTIONS.sortPackageJson).toBe(false)
  })

  it('ignores Edge templates because Oxfmt cannot load prettier-edge', () => {
    expect(OPTIONS.ignorePatterns).toEqual(expect.arrayContaining(['**/*.edge', '**/*.edgejs']))
  })

  it('merges extra options on top of the preset', () => {
    const config = configOxfmt({
      printWidth: 80,
      ignorePatterns: ['tmp/**'],
    })

    expect(config.printWidth).toBe(80)
    expect(config.singleQuote).toBe(true)
    expect(config.ignorePatterns).toEqual(['**/*.edge', '**/*.edgejs', 'tmp/**'])
  })

  it('returns a new object from configOxfmt', () => {
    expect(configOxfmt()).not.toBe(OPTIONS)
    expect(configOxfmt()).toMatchObject(OPTIONS)
  })
})
