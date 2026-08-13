import type { RuleConfig } from './types'

/**
 * Shared rule list mapped from `@adonisjs/eslint-config`.
 *
 * Formatting rules from `@stylistic/eslint-plugin` and `eslint-plugin-prettier`
 * are intentionally omitted: Oxlint is a linter, not a formatter.
 */
export const RULES_LIST = {
  'curly': ['error', 'all'],
  'eqeqeq': ['error', 'always'],
  'node/handle-callback-err': ['error', '^(err|error)$'],
  'no-array-constructor': ['error'],
  'no-caller': ['error'],
  'no-cond-assign': ['error', 'except-parens'],
  'no-constant-condition': ['error'],
  'no-control-regex': ['error'],
  'no-debugger': ['error'],
  'no-duplicate-case': ['error'],
  'no-eval': ['error'],
  'no-ex-assign': ['error'],
  'no-extra-boolean-cast': ['error'],
  'no-fallthrough': ['error'],
  'no-inner-declarations': ['error'],
  'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],
  'no-irregular-whitespace': ['error'],
  'no-new-wrappers': ['error'],
  'no-proto': ['error'],
  'no-regex-spaces': ['error'],
  'no-self-assign': ['error'],
  'no-self-compare': ['error'],
  'no-shadow': 'error',
  'no-sparse-arrays': ['error'],
  'no-this-before-super': ['error'],
  'no-unreachable': ['error'],
  'no-unsafe-finally': ['error'],
  'no-unsafe-negation': ['error'],
  'no-with': ['error'],
  'one-var': ['error', 'never'],
  'use-isnan': ['error'],
  'valid-typeof': ['error', { requireStringLiterals: true }],

  'typescript/consistent-type-imports': [
    'error',
    {
      fixStyle: 'inline-type-imports',
      disallowTypeAnnotations: false,
    },
  ],

  'unicorn/prefer-module': 'error',
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/filename-case': ['error', { case: 'snakeCase' }],
  'unicorn/no-await-expression-member': 'error',
  'unicorn/no-instanceof-builtins': 'error',
  'unicorn/prefer-number-properties': 'error',

  '@adonisjs/no-undef-init': 'error',
  '@adonisjs/no-for-loop': 'error',
  '@adonisjs/naming-convention': 'error',
} as const satisfies RuleConfig

export const APP_RULES_LIST = {
  ...RULES_LIST,
  '@adonisjs/prefer-lazy-controller-import': 'error',
  '@adonisjs/prefer-lazy-listener-import': 'error',
} as const satisfies RuleConfig

export const INERTIA_RULES_LIST = {
  '@adonisjs/no-backend-import-in-frontend': 'error',
  '@adonisjs/prefer-adonisjs-inertia-link': 'error',
  '@adonisjs/prefer-adonisjs-inertia-form': 'error',
} as const satisfies RuleConfig

export const VUE_RULES_LIST = {
  'vue/define-emits-declaration': ['error', 'type-based'],
  'vue/define-props-declaration': ['error', 'type-based'],
  'vue/component-definition-name-casing': ['error', 'PascalCase'],
} as const satisfies RuleConfig

export const REACT_RULES_LIST = {
  'react/display-name': 'error',
  'react/jsx-key': 'error',
  'react/jsx-no-comment-textnodes': 'error',
  'react/jsx-no-duplicate-props': 'error',
  'react/jsx-no-target-blank': 'error',
  'react/jsx-no-undef': 'error',
  'react/no-danger-with-children': 'error',
  'react/no-direct-mutation-state': 'error',
  'react/no-find-dom-node': 'error',
  'react/no-is-mounted': 'error',
  'react/no-render-return-value': 'error',
  'react/no-string-refs': 'error',
  'react/no-unescaped-entities': 'error',
  'react/no-unknown-property': 'error',
  'react/no-unsafe': 'error',
  'react/react-in-jsx-scope': 'off',
  'react/no-children-prop': 'off',
  'react/self-closing-comp': 'error',
  'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  'react/rules-of-hooks': 'error',
  'react/exhaustive-deps': 'warn',
} as const satisfies RuleConfig
