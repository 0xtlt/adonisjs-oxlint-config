import { statSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'

import { parseEdge } from './parse'
import { printDocument } from './print'
import { EDGE_EXTENSIONS } from './options'
import type { EdgeFormatOptions } from '../types'

const SKIP_DIRECTORIES = new Set([
  'node_modules',
  'dist',
  'coverage',
  'output',
  'build',
  'temp',
  '.git',
  '.hg',
  '.svn',
  '.jj',
])

export interface FormatEdgeProjectOptions {
  check?: boolean
  cwd?: string
  paths?: string[]
  overrides?: EdgeFormatOptions
}

export interface FormatEdgeProjectResult {
  checked: number
  changed: string[]
}

export async function formatEdge(
  source: string,
  overrides: EdgeFormatOptions = {}
): Promise<string> {
  try {
    const ast = parseEdge(source)
    return await printDocument(ast, overrides)
  } catch {
    return source.endsWith('\n') ? source : `${source}\n`
  }
}

export async function collectEdgeFiles(directory: string): Promise<string[]> {
  const files: string[] = []

  async function walk(current: string): Promise<void> {
    const entries = await readdir(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(current, entry.name)

      if (entry.isDirectory()) {
        if (SKIP_DIRECTORIES.has(entry.name) || entry.name.startsWith('.')) {
          continue
        }
        await walk(fullPath)
        continue
      }

      if (isEdgeFile(entry.name)) {
        files.push(fullPath)
      }
    }
  }

  await walk(directory)
  return files.sort()
}

export function isEdgeFile(filePath: string): boolean {
  return EDGE_EXTENSIONS.includes(extname(filePath) as (typeof EDGE_EXTENSIONS)[number])
}

async function resolveEdgePaths(cwd: string, paths: string[]): Promise<string[]> {
  const files: string[] = []

  for (const path of paths) {
    const absolutePath = isAbsolute(path) ? path : resolve(cwd, path)
    const stats = statSync(absolutePath)

    if (stats.isDirectory()) {
      files.push(...(await collectEdgeFiles(absolutePath)))
      continue
    }

    if (isEdgeFile(absolutePath)) {
      files.push(absolutePath)
    }
  }

  return [...new Set(files)].sort()
}

export async function formatEdgeProject(
  options: FormatEdgeProjectOptions = {}
): Promise<FormatEdgeProjectResult> {
  const cwd = options.cwd ?? process.cwd()
  const files = options.paths?.length
    ? await resolveEdgePaths(cwd, options.paths)
    : await collectEdgeFiles(cwd)

  const changed: string[] = []

  for (const file of files) {
    const original = await readFile(file, 'utf8')
    const formatted = await formatEdge(original, options.overrides)

    if (formatted === original) {
      continue
    }

    changed.push(relative(cwd, file) || file)
    if (!options.check) {
      await writeFile(file, formatted)
    }
  }

  return { checked: files.length, changed }
}
