import { type ImportDeclarationNode, isIdentifier } from '../ast'
import { createRule } from '../types'

const INERTIA_PACKAGES = new Set(['@inertiajs/react', '@inertiajs/vue3'])

function importedName(node: ImportDeclarationNode, expected: string): boolean {
  return node.specifiers.some((specifier) => {
    if (specifier.type !== 'ImportSpecifier' || !specifier.imported) {
      return false
    }

    return isIdentifier(specifier.imported, expected)
  })
}

function frameworkFromSource(source: string): 'react' | 'vue' {
  return source === '@inertiajs/react' ? 'react' : 'vue'
}

/**
 * Prefer the typesafe AdonisJS Inertia Form component.
 */
export default createRule({
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer the typesafe @adonisjs/inertia Form component over the @inertiajs Form component',
    },
    schema: [],
    messages: {
      preferAdonisInertiaForm:
        'Prefer importing Form from @adonisjs/inertia/{{ framework }} for typesafe routing instead of {{ source }}',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node: ImportDeclarationNode) {
        const source = node.source.value
        if (!INERTIA_PACKAGES.has(source) || !importedName(node, 'Form')) {
          return
        }

        context.report({
          node,
          messageId: 'preferAdonisInertiaForm',
          data: { framework: frameworkFromSource(source), source },
        })
      },
    }
  },
})
