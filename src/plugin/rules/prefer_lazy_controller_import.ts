import { type ArrayExpressionNode, type CallExpressionNode, type ImportDeclarationNode, isIdentifier, isMemberCall, isMemberExpression } from '../ast'
import { createRule } from '../types'

const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch'])

/**
 * Prefer lazy controller imports so AdonisJS HMR can reload route handlers.
 */
export default createRule({
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: '(Needed for HMR) Prefer lazy controller import over standard import',
    },
    schema: [],
    messages: {
      preferLazyControllerImport: 'Replace standard import with lazy controller import',
    },
  },
  create(context) {
    const importNodes = new Map<string, ImportDeclarationNode>()
    const importIdentifiers = new Set<string>()
    let routerIdentifier = ''

    return {
      ImportDeclaration(node: ImportDeclarationNode) {
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier') {
            importIdentifiers.add(specifier.local.name)
            importNodes.set(specifier.local.name, node)
          }
        }

        if (node.source.value === '@adonisjs/core/services/router' && node.specifiers[0]?.type === 'ImportDefaultSpecifier') {
          routerIdentifier = node.specifiers[0].local.name
        }
      },
      CallExpression(node: CallExpressionNode) {
        if (!routerIdentifier) {
          return
        }

        let controllerName: string | null = null

        if (isMemberExpression(node.callee) && isIdentifier(node.callee.property)) {
          const methodName = node.callee.property.name
          if (isMemberCall(node, routerIdentifier, methodName) && HTTP_METHODS.has(methodName)) {
            const secondArgument = node.arguments[1] as ArrayExpressionNode | undefined
            if (secondArgument?.type === 'ArrayExpression' && isIdentifier(secondArgument.elements[0])) {
              controllerName = secondArgument.elements[0].name
            }
          }
        }

        if (isMemberCall(node, routerIdentifier, 'resource') && isIdentifier(node.arguments[1])) {
          controllerName = node.arguments[1].name
        }

        if (!controllerName || !importIdentifiers.has(controllerName)) {
          return
        }

        const importNode = importNodes.get(controllerName)
        if (!importNode) {
          return
        }

        context.report({
          node: importNode,
          messageId: 'preferLazyControllerImport',
          fix(fixer) {
            const importPath = importNode.source.raw ?? JSON.stringify(importNode.source.value)
            return fixer.replaceText(importNode, `const ${controllerName} = () => import(${importPath})`)
          },
        })
      },
    }
  },
})
