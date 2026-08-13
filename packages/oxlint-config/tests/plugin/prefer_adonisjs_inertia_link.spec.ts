import preferAdonisjsInertiaLink from '../../src/plugin/rules/prefer_adonisjs_inertia_link'
import { runRule } from './create_rule_tester'

runRule('prefer-adonisjs-inertia-link', preferAdonisjsInertiaLink, {
  valid: [
    {
      name: 'Import Link from @adonisjs/inertia/react',
      code: `import { Link } from '@adonisjs/inertia/react'`,
    },
    {
      name: 'Import Link from @adonisjs/inertia/vue',
      code: `import { Link } from '@adonisjs/inertia/vue'`,
    },
    {
      name: 'Import other components from @inertiajs/react',
      code: `import { useForm, usePage } from '@inertiajs/react'`,
    },
    {
      name: 'Import other components from @inertiajs/vue3',
      code: `import { useForm, usePage } from '@inertiajs/vue3'`,
    },
    {
      name: 'Import router from @inertiajs/react',
      code: `import { router } from '@inertiajs/react'`,
    },
  ],
  invalid: [
    {
      name: 'Import Link from @inertiajs/react',
      code: `import { Link } from '@inertiajs/react'`,
      errors: [{ messageId: 'preferAdonisInertiaLink' }],
    },
    {
      name: 'Import Link from @inertiajs/vue3',
      code: `import { Link } from '@inertiajs/vue3'`,
      errors: [{ messageId: 'preferAdonisInertiaLink' }],
    },
    {
      name: 'Import Link with alias from @inertiajs/react',
      code: `import { Link as InertiaLink } from '@inertiajs/react'`,
      errors: [{ messageId: 'preferAdonisInertiaLink' }],
    },
    {
      name: 'Import Link along with other components from @inertiajs/react',
      code: `import { Link, useForm, usePage } from '@inertiajs/react'`,
      errors: [{ messageId: 'preferAdonisInertiaLink' }],
    },
  ],
})
