import { dirname, resolve } from 'node:path'

import micromatch from 'micromatch'
import { readPackageUpSync } from 'read-package-up'

import { type ImportDeclarationNode } from '../ast'
import { createRule } from '../types'

type SubpathTarget = string | string[] | Record<string, unknown>
type SubpathImports = Record<string, SubpathTarget>

const packageCache = new Map<string, { imports: SubpathImports | null }>()

function getSubpathImports(filename: string): SubpathImports | null {
  const cwd = dirname(filename)
  const cached = packageCache.get(cwd)
  if (cached) {
    return cached.imports
  }

  const result = readPackageUpSync({ cwd, normalize: false })
  if (!result) {
    packageCache.set(cwd, { imports: null })
    return null
  }

  const imports = (result.packageJson.imports as SubpathImports | undefined) ?? null
  packageCache.set(cwd, { imports })
  return imports
}

function resolveImportTarget(target: SubpathTarget): string[] {
  if (typeof target === 'string') {
    return [target]
  }
  if (Array.isArray(target)) {
    return target.flatMap((item) => resolveImportTarget(item))
  }
  if (typeof target === 'object' && target !== null) {
    return Object.values(target).flatMap((value) => resolveImportTarget(value as SubpathTarget))
  }
  return []
}

function subpathResolvesToFrontend(importPath: string, subpathImports: SubpathImports): boolean {
  for (const [pattern, target] of Object.entries(subpathImports)) {
    const patternBase = pattern.replace('/*', '').replace('*', '')
    const importBase = importPath.replace('/*', '').replace('*', '')

    if (importPath === pattern || importBase.startsWith(patternBase)) {
      const isFrontend = resolveImportTarget(target).some((resolved) => {
        return resolved.startsWith('./inertia/') || resolved.startsWith('inertia/')
      })
      if (isFrontend) {
        return true
      }
    }
  }

  return false
}

function relativePathResolvesToFrontend(importPath: string, filename: string): boolean {
  const absolutePath = resolve(dirname(filename), importPath)
  return /[\\/]inertia[\\/]/.test(absolutePath)
}

export interface NoBackendImportOptions {
  allowed?: string[]
}

/**
 * Prevent importing backend modules from Inertia frontend files.
 */
export default createRule<[{ allowed?: string[] }?]>({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing backend code in frontend (Inertia) files',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            type: 'array',
            items: { type: 'string' },
            description:
              'List of allowed import paths or glob patterns (e.g. "#shared/*", "#enums")',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noBackendImport:
        'Importing backend code "{{ importPath }}" in frontend files is not allowed. Use `import type` for type-only imports, or add the path to the `allowed` option.',
    },
  },
  create(context) {
    const filename = context.filename
    const allowed = context.options[0]?.allowed ?? []

    if (!/[\\/]inertia[\\/]/.test(filename)) {
      return {}
    }

    const subpathImports = getSubpathImports(filename)

    return {
      ImportDeclaration(node: ImportDeclarationNode) {
        const importPath = node.source.value

        if (node.importKind === 'type') {
          return
        }

        if (allowed.length > 0 && micromatch.isMatch(importPath, allowed)) {
          return
        }

        if (importPath.startsWith('#')) {
          if (!subpathImports) {
            return
          }
          if (subpathResolvesToFrontend(importPath, subpathImports)) {
            return
          }

          context.report({ node, messageId: 'noBackendImport', data: { importPath } })
          return
        }

        if (importPath.startsWith('.') && !relativePathResolvesToFrontend(importPath, filename)) {
          context.report({ node, messageId: 'noBackendImport', data: { importPath } })
        }
      },
    }
  },
})
