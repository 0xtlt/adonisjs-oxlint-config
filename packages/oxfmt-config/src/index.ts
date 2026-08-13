import { OPTIONS } from './options'
import type { ConfigOverrides, OxfmtConfig } from './types'

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

/**
 * Opinionated Oxfmt config matching `@adonisjs/prettier-config`.
 *
 * Extra options are merged on top of the preset. Later keys win.
 * `ignorePatterns` are concatenated.
 */
export function configOxfmt(overrides: ConfigOverrides = {}): OxfmtConfig {
  return {
    ...OPTIONS,
    ...overrides,
    ignorePatterns: unique([
      ...(OPTIONS.ignorePatterns ?? []),
      ...(overrides.ignorePatterns ?? []),
    ]),
  }
}

export { OPTIONS }
export type { ConfigOverrides, OxfmtConfig }

export default OPTIONS
