import { PLUGINS_LIST, VUE_FILES } from '../constants'
import { RULES_LIST, VUE_RULES_LIST } from '../rules'
import type { OxlintConfig } from '../types'

/**
 * Vue-specific Oxlint config block for AdonisJS apps.
 *
 * Native Oxlint Vue coverage is limited to `<script>` blocks.
 * `component-definition-name-casing` enforces PascalCase component names.
 */
export const vue: OxlintConfig = {
  plugins: [...PLUGINS_LIST, 'vue'],
  overrides: [
    {
      files: [...VUE_FILES],
      plugins: [...PLUGINS_LIST, 'vue'],
      rules: {
        ...RULES_LIST,
        ...VUE_RULES_LIST,
      },
    },
  ],
}

export default vue
