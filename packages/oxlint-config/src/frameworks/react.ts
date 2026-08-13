import { PLUGINS_LIST, REACT_FILES } from '../constants'
import { REACT_RULES_LIST, RULES_LIST } from '../rules'
import type { OxlintConfig } from '../types'

/**
 * React-specific Oxlint config block for AdonisJS apps.
 *
 * The native `react` plugin includes React Hooks rules.
 */
export const react: OxlintConfig = {
  plugins: [...PLUGINS_LIST, 'react'],
  settings: {
    react: { version: '19.0' },
  },
  overrides: [
    {
      files: [...REACT_FILES],
      plugins: [...PLUGINS_LIST, 'react'],
      rules: {
        ...RULES_LIST,
        ...REACT_RULES_LIST,
      },
    },
  ],
}

export default react
