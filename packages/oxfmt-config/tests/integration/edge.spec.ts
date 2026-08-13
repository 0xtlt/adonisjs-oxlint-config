import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { formatEdgeProject } from '../../src/edge/format'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')

function createTempProject(): { directory: string; cleanup: () => void } {
  const directory = mkdtempSync(join(tmpdir(), 'adonisjs-oxfmt-edge-'))
  return {
    directory,
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  }
}

function runEdgeCli(
  directory: string,
  args: string[] = []
): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync(
      process.execPath,
      [join(packageRoot, 'dist/cli/edge.js'), ...args],
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

describe('Edge formatter integration', () => {
  it('writes formatted Edge templates', async () => {
    const project = createTempProject()

    try {
      mkdirSync(join(project.directory, 'resources/views'), { recursive: true })
      writeFileSync(
        join(project.directory, 'resources/views/home.edge'),
        `@if(user)\n<p>{{user.name}}</p>\n@end\n`
      )

      const result = await formatEdgeProject({ cwd: project.directory })
      expect(result.checked).toBe(1)
      expect(result.changed).toEqual(['resources/views/home.edge'])
      expect(readFileSync(join(project.directory, 'resources/views/home.edge'), 'utf8')).toBe(
        `@if(user)\n  <p>{{ user.name }}</p>\n@end\n`
      )
    } finally {
      project.cleanup()
    }
  })

  it('fails --check when Edge templates are unformatted', () => {
    const project = createTempProject()

    try {
      writeFileSync(join(project.directory, 'home.edge'), `@if(user)\n<p>{{user.name}}</p>\n@end\n`)

      const result = runEdgeCli(project.directory, ['--check'])
      expect(result.status).not.toBe(0)
      expect(`${result.stdout}\n${result.stderr}`).toMatch(/home\.edge/)
    } finally {
      project.cleanup()
    }
  })
})
