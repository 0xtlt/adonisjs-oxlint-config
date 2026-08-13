import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'

import { describe, expect, it } from 'vitest'

import { configOxfmt } from '../../src/index'

const require = createRequire(import.meta.url)

function createTempProject(): { directory: string; cleanup: () => void } {
  const directory = mkdtempSync(join(tmpdir(), 'adonisjs-oxfmt-'))
  return {
    directory,
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  }
}

function runOxfmt(
  directory: string,
  args: string[] = []
): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync(
      process.execPath,
      [join(dirname(require.resolve('oxfmt/package.json')), 'bin/oxfmt'), ...args],
      {
        cwd: directory,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    )
    return { stdout, stderr: '', status: 0 }
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string; status?: number }
    return {
      stdout: failure.stdout ?? '',
      stderr: failure.stderr ?? '',
      status: failure.status ?? 1,
    }
  }
}

describe('oxfmt integration', () => {
  it('formats TypeScript with the AdonisJS Oxfmt options', () => {
    const project = createTempProject()

    try {
      writeFileSync(
        join(project.directory, '.oxfmtrc.json'),
        `${JSON.stringify(configOxfmt(), null, 2)}\n`
      )
      mkdirSync(join(project.directory, 'src'))
      writeFileSync(
        join(project.directory, 'src/user_service.ts'),
        `export const demo = (value:string)=>{if(value==="ok"){return{foo:"bar",baz:"qux"}}}\n`
      )

      const result = runOxfmt(project.directory, ['--write', 'src/user_service.ts'])
      expect(result.status).toBe(0)

      const formatted = readFileSync(join(project.directory, 'src/user_service.ts'), 'utf8')
      expect(formatted).toContain('value: string')
      expect(formatted).toContain("value === 'ok'")
      expect(formatted.includes(';')).toBe(false)
      expect(formatted).toMatch(/\{\s*foo: 'bar'/)
    } finally {
      project.cleanup()
    }
  })

  it('fails --check on unformatted files', () => {
    const project = createTempProject()

    try {
      writeFileSync(
        join(project.directory, '.oxfmtrc.json'),
        `${JSON.stringify(configOxfmt(), null, 2)}\n`
      )
      writeFileSync(join(project.directory, 'messy.ts'), `export const x=(a:string)=>a\n`)

      const result = runOxfmt(project.directory, ['--check', 'messy.ts'])
      expect(result.status).not.toBe(0)
    } finally {
      project.cleanup()
    }
  })

  it('leaves Edge templates for formatEdge instead of formatting them with Oxfmt', () => {
    const project = createTempProject()
    const original = `@if(user)\n  <p>{{ user.name }}</p>\n@end\n`

    try {
      writeFileSync(
        join(project.directory, '.oxfmtrc.json'),
        `${JSON.stringify(configOxfmt(), null, 2)}\n`
      )
      writeFileSync(join(project.directory, 'home.edge'), original)
      writeFileSync(join(project.directory, 'ok.ts'), 'export const x = 1\n')

      const result = runOxfmt(project.directory, ['--write', '.'])
      expect(result.status).toBe(0)
      expect(readFileSync(join(project.directory, 'home.edge'), 'utf8')).toBe(original)
    } finally {
      project.cleanup()
    }
  })

  it('does not sort package.json keys the way Oxfmt does by default', () => {
    const project = createTempProject()
    const original = `${JSON.stringify({ version: '1.0.0', name: 'demo', scripts: { test: 'echo ok' } }, null, 2)}\n`

    try {
      writeFileSync(
        join(project.directory, '.oxfmtrc.json'),
        `${JSON.stringify(configOxfmt(), null, 2)}\n`
      )
      writeFileSync(join(project.directory, 'package.json'), original)

      const result = runOxfmt(project.directory, ['--write', 'package.json'])
      expect(result.status).toBe(0)
      expect(readFileSync(join(project.directory, 'package.json'), 'utf8')).toBe(original)
    } finally {
      project.cleanup()
    }
  })
})
