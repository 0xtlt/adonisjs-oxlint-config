import { type ForStatementNode } from '../ast'
import { createRule } from '../types'

/**
 * Disallow classic `for` loops that iterate an array by index.
 */
export default createRule({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Do not use a for loop that can be replaced with a for-of loop',
    },
    schema: [],
    messages: {
      noForLoop: 'Use `for…of` instead of a classic `for` loop.',
    },
  },
  create(context) {
    return {
      ForStatement(node: ForStatementNode) {
        if (isIndexLengthLoop(node)) {
          context.report({ node, messageId: 'noForLoop' })
        }
      },
    }
  },
})

function isIndexLengthLoop(node: ForStatementNode): boolean {
  const init = node.init as {
    type?: string
    declarations?: Array<{ id?: { name?: string } }>
  } | null
  const test = node.test as {
    type?: string
    operator?: string
    left?: { type?: string; name?: string }
    right?: { type?: string; object?: { name?: string }; property?: { name?: string } }
  } | null
  const update = node.update as {
    type?: string
    operator?: string
    argument?: { name?: string }
    prefix?: boolean
  } | null

  if (!init || init.type !== 'VariableDeclaration' || !init.declarations?.[0]?.id?.name) {
    return false
  }

  const indexName = init.declarations[0].id.name

  if (
    !test ||
    test.type !== 'BinaryExpression' ||
    (test.operator !== '<' && test.operator !== '<=')
  ) {
    return false
  }

  const comparesIndex = test.left?.type === 'Identifier' && test.left.name === indexName
  const comparesLength =
    test.right?.type === 'MemberExpression' && test.right.property?.name === 'length'
  if (!comparesIndex || !comparesLength) {
    return false
  }

  if (!update) {
    return false
  }

  if (update.type === 'UpdateExpression') {
    return (
      update.argument?.name === indexName && (update.operator === '++' || update.operator === '--')
    )
  }

  if (update.type === 'AssignmentExpression') {
    return (
      (update as { left?: { name?: string } }).left?.name === indexName &&
      (update.operator === '+=' || update.operator === '-=')
    )
  }

  return false
}
