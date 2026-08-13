import { PLUGINS_LIST, VUE_FILES } from '../constants'
import { RULES_LIST, VUE_RULES_LIST } from '../rules'
import type { OxlintConfig } from '../types'

/**
 * Vue-specific Oxlint config block for AdonisJS apps.
 *
 * Native Oxlint Vue coverage is limited to `<script>` blocks. Rules that need
 * the Vue template AST (`block-order`, `component-api-style`,
 * `multi-word-component-names`, `component-name-in-template-casing`) are not
 * available yet; `component-definition-name-casing` is the closest native
 * equivalent for PascalCase component names.
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
