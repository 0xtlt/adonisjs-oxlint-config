import preferAdonisjsInertiaForm from '../../src/plugin/rules/prefer_adonisjs_inertia_form'
import { runRule } from './create_rule_tester'

runRule('prefer-adonisjs-inertia-form', preferAdonisjsInertiaForm, {
  valid: [
    { name: 'Import Form from @adonisjs/inertia/react', code: `import { Form } from '@adonisjs/inertia/react'` },
    { name: 'Import Form from @adonisjs/inertia/vue', code: `import { Form } from '@adonisjs/inertia/vue'` },
    { name: 'Import other components from @inertiajs/react', code: `import { useForm, usePage } from '@inertiajs/react'` },
    { name: 'Import router from @inertiajs/react', code: `import { router } from '@inertiajs/react'` },
  ],
  invalid: [
    {
      name: 'Import Form from @inertiajs/react',
      code: `import { Form } from '@inertiajs/react'`,
      errors: [{ messageId: 'preferAdonisInertiaForm' }],
    },
    {
      name: 'Import Form from @inertiajs/vue3',
      code: `import { Form } from '@inertiajs/vue3'`,
      errors: [{ messageId: 'preferAdonisInertiaForm' }],
    },
    {
      name: 'Import Form with alias from @inertiajs/react',
      code: `import { Form as InertiaForm } from '@inertiajs/react'`,
      errors: [{ messageId: 'preferAdonisInertiaForm' }],
    },
    {
      name: 'Import Form along with other components from @inertiajs/react',
      code: `import { Form, useForm, usePage } from '@inertiajs/react'`,
      errors: [{ messageId: 'preferAdonisInertiaForm' }],
    },
  ],
})
