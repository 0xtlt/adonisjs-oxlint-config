export interface IdentifierNode {
  type: string
  name: string
}

export interface LiteralNode {
  type: string
  value: string | number | boolean | null
  raw?: string
}

export interface ImportSpecifierNode {
  type: string
  imported?: IdentifierNode
  local: IdentifierNode
}

export interface ImportDeclarationNode {
  type: string
  importKind?: 'type' | 'value'
  source: { value: string; raw?: string }
  specifiers: ImportSpecifierNode[]
}

export interface MemberExpressionNode {
  type: string
  object: IdentifierNode
  property: IdentifierNode
}

export interface ArrayExpressionNode {
  type: string
  elements: Array<unknown>
}

export interface CallExpressionNode {
  type: string
  callee: MemberExpressionNode | IdentifierNode
  arguments: unknown[]
}

export interface VariableDeclaratorNode {
  type: string
  id: IdentifierNode | unknown
  init: { type: string; name?: string } | null
}

export interface VariableDeclarationNode {
  type: string
  kind: 'var' | 'let' | 'const'
  declarations: VariableDeclaratorNode[]
}

export interface ClassDeclarationNode {
  type: string
  id: IdentifierNode | null
}

export interface TSInterfaceDeclarationNode {
  type: string
  id: IdentifierNode
}

export interface TSTypeAliasDeclarationNode {
  type: string
  id: IdentifierNode
}

export interface TSEnumDeclarationNode {
  type: string
  id: IdentifierNode
}

export interface TSTypeParameterNode {
  type: string
  name: string | IdentifierNode
}

export interface ForStatementNode {
  type: string
  init: unknown
  test: unknown
  update: unknown
}

export function isIdentifier(node: unknown, name?: string): node is IdentifierNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as IdentifierNode).type === 'Identifier' &&
    (name === undefined || (node as IdentifierNode).name === name)
  )
}

export function isMemberExpression(node: unknown): node is MemberExpressionNode {
  return typeof node === 'object' && node !== null && (node as MemberExpressionNode).type === 'MemberExpression'
}

export function isMemberCall(node: CallExpressionNode, objectName: string, method: string): boolean {
  return (
    isMemberExpression(node.callee) &&
    isIdentifier(node.callee.object, objectName) &&
    isIdentifier(node.callee.property, method)
  )
}
