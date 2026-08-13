import namingConvention from '../../src/plugin/rules/naming_convention'
import noForLoop from '../../src/plugin/rules/no_for_loop'
import noUndefInit from '../../src/plugin/rules/no_undef_init'
import { runRule } from './create_rule_tester'

runRule('no-undef-init', noUndefInit, {
  valid: ['let foo', 'const bar = undefined', 'let baz = 1'],
  invalid: [
    {
      code: 'let foo = undefined',
      output: 'let foo',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var foo = undefined',
      output: 'var foo',
      errors: [{ messageId: 'unexpected' }],
    },
  ],
})

runRule('no-for-loop', noForLoop, {
  valid: [
    'for (const item of items) { item() }',
    'for (const key in object) { object[key] }',
    'for (;;) { break }',
  ],
  invalid: [
    {
      code: 'for (let i = 0; i < items.length; i++) { items[i] }',
      errors: [{ messageId: 'noForLoop' }],
    },
    {
      code: 'for (let i = 0; i <= items.length; i += 1) { items[i] }',
      errors: [{ messageId: 'noForLoop' }],
    },
  ],
})

runRule('naming-convention', namingConvention, {
  valid: [
    { code: 'const userName = 1; const MAX_COUNT = 2; class User {}; interface UserProps {}' },
    { code: 'type UserId = string; enum Status { Active }' },
  ],
  invalid: [
    {
      code: 'const user_name = 1',
      errors: [{ messageId: 'invalidName' }],
    },
    {
      code: 'interface IUser {}',
      errors: [{ messageId: 'custom' }],
    },
    {
      code: 'class user {}',
      errors: [{ messageId: 'invalidName' }, { messageId: 'invalidName' }],
    },
    {
      code: 'type user_id = string',
      errors: [{ messageId: 'invalidName' }],
    },
  ],
})
