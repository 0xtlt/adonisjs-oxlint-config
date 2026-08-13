import { applyConfigBlocks, createBaseConfig } from './create_base_config'
import { RULES_LIST } from './rules'
import type { ConfigBlock, OxlintConfig } from './types'

/**
 * Opinionated Oxlint config for a TypeScript package.
 *
 * Extra config blocks are merged on top of the preset. Later blocks win.
 */
export function configPkg(...configBlocksToMerge: ConfigBlock[]): OxlintConfig {
  return applyConfigBlocks(createBaseConfig(RULES_LIST), configBlocksToMerge)
}
