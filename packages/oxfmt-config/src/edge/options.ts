import type { EdgeFormatOptions } from '../types'

export const EDGE_OPTIONS = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  edgeMustacheSpacing: 1,
  edgeAttributeQuotes: 'double',
  edgeBlankLinesInBlocks: 1,
} as const satisfies EdgeFormatOptions

export const EDGE_EXTENSIONS = ['.edge', '.edgejs'] as const

export function configEdge(overrides: EdgeFormatOptions = {}): EdgeFormatOptions {
  return {
    ...EDGE_OPTIONS,
    ...overrides,
  }
}
