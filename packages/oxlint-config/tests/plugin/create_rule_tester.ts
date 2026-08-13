import { RuleTester } from 'oxlint/plugins-dev'
import { describe, it } from 'vitest'

import type { RuleModule } from '../../src/plugin/types'

RuleTester.describe = describe
RuleTester.it = it

export function createRuleTester(): RuleTester {
  return new RuleTester({
    eslintCompat: true,
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        lang: 'ts',
      },
    },
  })
}

export function runRule(ruleName: string, rule: RuleModule<any>, tests: any): void {
  const tester = createRuleTester()
  tester.run(ruleName, rule as never, tests)
}
