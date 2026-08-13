import { createRequire } from 'node:module'

import { applyConfigBlocks, createBaseConfig } from './create_base_config'
import { APP_RULES_LIST, INERTIA_RULES_LIST } from './rules'
import { INERTIA_FILES } from './constants'
import type { ConfigBlock, OxlintConfig } from './types'

function isInertiaInstalled(): boolean {
  try {
    createRequire(import.meta.url).resolve('@adonisjs/inertia/package.json')
    return true
  } catch {
    try {
      createRequire(import.meta.url).resolve('@adonisjs/inertia')
      return true
    } catch {
      return false
    }
  }
}

const inertiaConfigBlock: OxlintConfig = {
  overrides: [
    {
      files: [...INERTIA_FILES],
      rules: { ...INERTIA_RULES_LIST },
    },
  ],
}

/**
 * Opinionated Oxlint config for an AdonisJS application.
 *
 * Extra config blocks are merged on top of the preset. Later blocks win.
 */
export function configApp(...configBlocksToMerge: ConfigBlock[]): OxlintConfig {
  const blocks: ConfigBlock[] = []
  if (isInertiaInstalled()) {
    blocks.push(inertiaConfigBlock)
  }

  return applyConfigBlocks(createBaseConfig(APP_RULES_LIST), [...blocks, ...configBlocksToMerge])
}

export { isInertiaInstalled, inertiaConfigBlock }
