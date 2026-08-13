import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import noBackendImportInFrontend from '../../src/plugin/rules/no_backend_import_in_frontend'
import { runRule } from './create_rule_tester'

function createTestProject() {
  const projectRoot = mkdtempSync(join(tmpdir(), 'oxlint-backend-import-'))
  const inertiaDir = join(projectRoot, 'inertia', 'pages')
  const backendDir = join(projectRoot, 'app', 'models')

  mkdirSync(inertiaDir, { recursive: true })
  mkdirSync(backendDir, { recursive: true })

  writeFileSync(
    join(projectRoot, 'package.json'),
    JSON.stringify(
      {
        name: 'test-project',
        imports: {
          '#models/*': './app/models/*.js',
          '#services/*': './app/services/*.js',
          '#controllers/*': './app/controllers/*.js',
          '#components/*': './inertia/components/*.js',
          '#frontend/*': './inertia/*.js',
          '#shared/*': './shared/*.js',
        },
      },
      null,
      2
    )
  )

  return {
    frontendFile: join(inertiaDir, 'users.tsx'),
    backendFile: join(backendDir, 'user.ts'),
    cleanup: () => rmSync(projectRoot, { recursive: true, force: true }),
  }
}

const testProject = createTestProject()

runRule('no-backend-import-in-frontend', noBackendImportInFrontend, {
  valid: [
    {
      name: 'Regular import outside inertia folder',
      filename: testProject.backendFile,
      code: `import User from '#models/user'`,
    },
    {
      name: 'Type-only import in inertia folder',
      filename: testProject.frontendFile,
      code: `import type { User } from '#models/user'`,
    },
    {
      name: 'Non-subpath import in inertia folder',
      filename: testProject.frontendFile,
      code: `import { Link } from '@adonisjs/inertia/react'`,
    },
    {
      name: 'Frontend subpath import (#components/*)',
      filename: testProject.frontendFile,
      code: `import { Button } from '#components/button'`,
    },
    {
      name: 'Frontend subpath import (#frontend/*)',
      filename: testProject.frontendFile,
      code: `import { utils } from '#frontend/utils'`,
    },
    {
      name: 'Allowed import with glob pattern',
      filename: testProject.frontendFile,
      options: [{ allowed: ['#shared/*'] }],
      code: `import { UserStatus } from '#shared/enums'`,
    },
    {
      name: 'Relative import within inertia folder',
      filename: testProject.frontendFile,
      code: `import { Button } from '../components/button'`,
    },
    {
      name: 'Type-only relative import to backend',
      filename: testProject.frontendFile,
      code: `import type { User } from '../../app/models/user'`,
    },
  ],
  invalid: [
    {
      name: 'Import model in inertia folder',
      filename: testProject.frontendFile,
      code: `import User from '#models/user'`,
      errors: [{ messageId: 'noBackendImport' }],
    },
    {
      name: 'Import service in inertia folder',
      filename: testProject.frontendFile,
      code: `import { UserService } from '#services/user_service'`,
      errors: [{ messageId: 'noBackendImport' }],
    },
    {
      name: 'Relative import to backend model',
      filename: testProject.frontendFile,
      code: `import User from '../../app/models/user'`,
      errors: [{ messageId: 'noBackendImport' }],
    },
  ],
})
