import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'

import type { OxlintConfig } from '../../src/types'

const require = createRequire(import.meta.url)

export interface LintMessage {
  code?: string
  rule?: string
  severity?: string
  message?: string
  filename?: string
}

export function writeOxlintConfig(directory: string, config: OxlintConfig): string {
  const configPath = join(directory, '.oxlintrc.json')
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
  return configPath
}

export function createTempProject(): { directory: string; cleanup: () => void } {
  const directory = mkdtempSync(join(tmpdir(), 'adonisjs-oxlint-'))
  return {
    directory,
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  }
}

export function writeProjectFile(
  directory: string,
  relativePath: string,
  contents: string
): string {
  const absolutePath = join(directory, relativePath)
  mkdirSync(join(absolutePath, '..'), { recursive: true })
  writeFileSync(absolutePath, contents)
  return absolutePath
}

export function runOxlint(
  directory: string,
  args: string[] = []
): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync(
      process.execPath,
      [
        join(dirname(require.resolve('oxlint/package.json')), 'bin/oxlint'),
        '--format',
        'unix',
        ...args,
      ],
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

export function parseOxlintJson(stdout: string): { diagnostics: LintMessage[] } {
  const trimmed = stdout.trim()
  if (!trimmed) {
    return { diagnostics: [] }
  }

  try {
    const parsed = JSON.parse(trimmed) as { diagnostics?: LintMessage[] } | LintMessage[]
    if (Array.isArray(parsed)) {
      return { diagnostics: parsed }
    }
    return { diagnostics: parsed.diagnostics ?? [] }
  } catch {
    return { diagnostics: [] }
  }
}
