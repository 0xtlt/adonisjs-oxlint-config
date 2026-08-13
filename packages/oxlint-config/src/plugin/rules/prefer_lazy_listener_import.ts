import {
  type ArrayExpressionNode,
  type CallExpressionNode,
  type ImportDeclarationNode,
  isIdentifier,
  isMemberCall,
} from '../ast'
import { createRule } from '../types'

/**
 * Prefer lazy listener imports so AdonisJS HMR can reload event handlers.
 */
export default createRule({
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: '(Needed for HMR) Prefer lazy listener import over standard import',
    },
    schema: [],
    messages: {
      preferLazyListenerImport: 'Replace standard import with lazy listener import',
    },
  },
  create(context) {
    const importNodes = new Map<string, ImportDeclarationNode>()
    const importIdentifiers = new Set<string>()
    let emitterIdentifier = ''

    return {
      ImportDeclaration(node: ImportDeclarationNode) {
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier') {
            importIdentifiers.add(specifier.local.name)
            importNodes.set(specifier.local.name, node)
          }
        }

        if (
          node.source.value === '@adonisjs/core/services/emitter' &&
          node.specifiers[0]?.type === 'ImportDefaultSpecifier'
        ) {
          emitterIdentifier = node.specifiers[0].local.name
        }
      },
      CallExpression(node: CallExpressionNode) {
        if (!emitterIdentifier || !isMemberCall(node, emitterIdentifier, 'on')) {
          return
        }

        const secondArgument = node.arguments[1] as ArrayExpressionNode | undefined
        if (secondArgument?.type !== 'ArrayExpression') {
          return
        }

        for (const element of secondArgument.elements) {
          if (!isIdentifier(element) || !importIdentifiers.has(element.name)) {
            continue
          }

          const importNode = importNodes.get(element.name)
          if (!importNode) {
            continue
          }

          context.report({
            node: importNode,
            messageId: 'preferLazyListenerImport',
            fix(fixer) {
              const importPath = importNode.source.raw ?? JSON.stringify(importNode.source.value)
              return fixer.replaceText(
                importNode,
                `const ${element.name} = () => import(${importPath})`
              )
            },
          })
        }
      },
    }
  },
})
