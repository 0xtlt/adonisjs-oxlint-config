import { type VariableDeclarationNode, type VariableDeclaratorNode, isIdentifier } from '../ast'
import { createRule } from '../types'

/**
 * Disallow initializing variables to `undefined` (eslint/no-undef-init).
 * `const` declarations are ignored because they require an initializer.
 */
export default createRule({
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Disallow initializing variables to undefined',
    },
    schema: [],
    messages: {
      unexpected: "Don't initialize {{ name }} to undefined.",
    },
  },
  create(context) {
    return {
      VariableDeclaration(node: VariableDeclarationNode) {
        if (node.kind === 'const') {
          return
        }

        for (const declarator of node.declarations) {
          reportIfUndefinedInit(context, declarator)
        }
      },
    }
  },
})

function reportIfUndefinedInit(
  context: {
    report: (descriptor: {
      node: unknown
      messageId: string
      data: { name: string }
      fix: (fixer: { replaceText: (node: unknown, text: string) => unknown }) => unknown
    }) => void
  },
  declarator: VariableDeclaratorNode
): void {
  if (
    !isIdentifier(declarator.id) ||
    !declarator.init ||
    !isIdentifier(declarator.init, 'undefined')
  ) {
    return
  }

  const name = declarator.id.name
  context.report({
    node: declarator.init,
    messageId: 'unexpected',
    data: { name },
    fix(fixer) {
      return fixer.replaceText(declarator, name)
    },
  })
}
