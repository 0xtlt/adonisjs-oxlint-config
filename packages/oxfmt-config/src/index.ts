import { OPTIONS } from './options'
import type { ConfigOverrides, OxfmtConfig } from './types'

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

/**
 * Opinionated Oxfmt config for AdonisJS packages and applications.
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
export {
  configEdge,
  collectEdgeFiles,
  formatEdge,
  formatEdgeProject,
  isEdgeFile,
  EDGE_EXTENSIONS,
  EDGE_OPTIONS,
} from './edge/index'
export type { ConfigOverrides, EdgeAttributeQuotes, EdgeFormatOptions, OxfmtConfig } from './types'
export type { FormatEdgeProjectOptions, FormatEdgeProjectResult } from './edge/index'

export default OPTIONS
