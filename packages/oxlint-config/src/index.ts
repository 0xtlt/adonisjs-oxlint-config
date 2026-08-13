import { ADONIS_IGNORE_LIST, GLOBAL_IGNORE_LIST, INCLUDE_LIST, PLUGINS_LIST } from './constants'
import { configApp } from './config_app'
import { configPkg } from './config_pkg'
import { mergeConfig, mergeConfigs } from './merge'
import {
  APP_RULES_LIST,
  INERTIA_RULES_LIST,
  REACT_RULES_LIST,
  RULES_LIST,
  VUE_RULES_LIST,
} from './rules'
import type { ConfigBlock, OxlintConfig } from './types'

export function defineConfig<T extends OxlintConfig>(config: T): T {
  return config
}

export {
  ADONIS_IGNORE_LIST,
  APP_RULES_LIST,
  GLOBAL_IGNORE_LIST,
  INCLUDE_LIST,
  INERTIA_RULES_LIST,
  PLUGINS_LIST,
  REACT_RULES_LIST,
  RULES_LIST,
  VUE_RULES_LIST,
  configApp,
  configPkg,
  mergeConfig,
  mergeConfigs,
}

export type { ConfigBlock, OxlintConfig }
