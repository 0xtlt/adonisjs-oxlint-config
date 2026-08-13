import { describe, expect, it } from 'vitest'

import { configApp, configPkg } from '../../src/index'
import { createTempProject, parseOxlintJson, runOxlint, writeOxlintConfig, writeProjectFile } from '../helpers/run_oxlint'

function ruleNames(stdout: string, stderr: string): string[] {
  const fromJson = parseOxlintJson(stdout).diagnostics
    .map((item) => item.code ?? item.rule ?? '')
    .filter(Boolean)

  if (fromJson.length > 0) {
    return fromJson
  }

  const combined = `${stdout}\n${stderr}`
  const matches = combined.matchAll(/\b((?:eslint|typescript|unicorn|node|react|vue|@adonisjs)\/[\w-]+|[\w-]+)\s*\(/g)
  return [...matches].map((match) => match[1] ?? '').filter(Boolean)
}

describe('oxlint integration', () => {
  it('reports native preset violations for a TypeScript package', () => {
    const project = createTempProject()

    try {
      writeOxlintConfig(project.directory, configPkg())
      writeProjectFile(
        project.directory,
        'src/bad_file.ts',
        `
export function demo(value) {
  if (value == 1) return value
  debugger
  return value
}
`
      )

      const result = runOxlint(project.directory, ['.'])
      const output = `${result.stdout}\n${result.stderr}`

      expect(result.status).not.toBe(0)
      expect(output).toMatch(/eqeqeq/)
      expect(output).toMatch(/curly/)
      expect(output).toMatch(/no-debugger/)
    } finally {
      project.cleanup()
    }
  })

  it('reports lazy controller import violations for an application preset', () => {
    const project = createTempProject()

    try {
      writeOxlintConfig(project.directory, configApp())
      writeProjectFile(
        project.directory,
        'start/routes.ts',
        `
import router from '@adonisjs/core/services/router'
import HomeController from '#controllers/home_controller'

router.get('/', [HomeController, 'index'])
`
      )

      const result = runOxlint(project.directory, ['start/routes.ts'])
      const output = `${result.stdout}\n${result.stderr}`

      expect(result.status).not.toBe(0)
      expect(output).toMatch(/prefer-lazy-controller-import/)
    } finally {
      project.cleanup()
    }
  })

  it('accepts valid AdonisJS package code', () => {
    const project = createTempProject()

    try {
      writeOxlintConfig(project.directory, configPkg())
      writeProjectFile(
        project.directory,
        'src/user_service.ts',
        `
export class UserService {
  public find(id: number): number {
    if (id === 0) {
      return 0
    }

    return id
  }
}
`
      )

      const result = runOxlint(project.directory, ['src/user_service.ts'])
      const names = ruleNames(result.stdout, result.stderr)

      expect(names.filter((name) => !name.includes('filename-case'))).toEqual([])
      expect(result.status).toBe(0)
    } finally {
      project.cleanup()
    }
  })
})
