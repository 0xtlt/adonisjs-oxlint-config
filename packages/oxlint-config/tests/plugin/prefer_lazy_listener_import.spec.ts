import preferLazyListenerImport from '../../src/plugin/rules/prefer_lazy_listener_import'
import { runRule } from './create_rule_tester'

runRule('prefer-lazy-listener-import', preferLazyListenerImport, {
  valid: [
    {
      name: 'Lazy import',
      code: `
        import emitter from '@adonisjs/core/services/emitter'
        const SendVerificationEmail = () => import('#listeners/send_verification_email')

        emitter.on('user:registered', [SendVerificationEmail, 'handle'])
      `,
    },
  ],
  invalid: [
    {
      name: 'Import expression',
      code: `
        import emitter from '@adonisjs/core/services/emitter'
        import SendVerificationEmail from '#listeners/send_verification_email'

        emitter.on('user:registered', [SendVerificationEmail, 'handle'])
      `,
      output: `
        import emitter from '@adonisjs/core/services/emitter'
        const SendVerificationEmail = () => import('#listeners/send_verification_email')

        emitter.on('user:registered', [SendVerificationEmail, 'handle'])
      `,
      errors: [{ messageId: 'preferLazyListenerImport' }],
    },
  ],
})
