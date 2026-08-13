import {
  type ClassDeclarationNode,
  type TSEnumDeclarationNode,
  type TSInterfaceDeclarationNode,
  type TSTypeAliasDeclarationNode,
  type TSTypeParameterNode,
  type VariableDeclaratorNode,
  isIdentifier,
} from '../ast'
import { createRule } from '../types'

type Format = 'camelCase' | 'PascalCase' | 'UPPER_CASE'

interface NamingSelector {
  selector: 'variable' | 'typeLike' | 'class' | 'interface'
  format: Format[]
  custom?: { regex: string; match: boolean }
}

const FORMATTERS: Record<Format, (name: string) => boolean> = {
  camelCase: (name) => /^[a-z][a-zA-Z0-9]*$/.test(name),
  PascalCase: (name) => /^[A-Z][a-zA-Z0-9]*$/.test(name),
  UPPER_CASE: (name) => /^[A-Z][A-Z0-9_]*$/.test(name),
}

function matchesFormat(name: string, formats: Format[]): boolean {
  return formats.some((format) => FORMATTERS[format](name))
}

function nameFromTypeParameter(node: TSTypeParameterNode): string | null {
  if (typeof node.name === 'string') {
    return node.name
  }
  if (isIdentifier(node.name)) {
    return node.name.name
  }
  return null
}

const DEFAULT_SELECTORS: NamingSelector[] = [
  { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
  { selector: 'typeLike', format: ['PascalCase'] },
  { selector: 'class', format: ['PascalCase'] },
  { selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: false } },
]

/**
 * AdonisJS subset of `@typescript-eslint/naming-convention`.
 */
export default createRule<[{ selectors?: NamingSelector[] }?]>({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce AdonisJS naming conventions for variables, types, classes, and interfaces',
    },
    schema: [
      {
        type: 'object',
        properties: {
          selectors: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidName: '{{ kind }} "{{ name }}" does not match the required format ({{ formats }}).',
      custom: '{{ kind }} "{{ name }}" does not match the custom naming constraint.',
    },
  },
  create(context) {
    const selectors = context.options[0]?.selectors ?? DEFAULT_SELECTORS

    function selectorFor(kind: NamingSelector['selector']): NamingSelector | undefined {
      return selectors.find((item) => item.selector === kind)
    }

    function check(kind: NamingSelector['selector'], name: string | null, node: unknown): void {
      if (!name || name === '_') {
        return
      }

      const selector = selectorFor(kind)
      if (!selector) {
        return
      }

      if (selector.custom) {
        const matches = new RegExp(selector.custom.regex).test(name)
        if (matches !== selector.custom.match) {
          context.report({
            node,
            messageId: 'custom',
            data: { kind, name },
          })
          return
        }
      }

      if (!matchesFormat(name, selector.format)) {
        context.report({
          node,
          messageId: 'invalidName',
          data: { kind, name, formats: selector.format.join(', ') },
        })
      }
    }

    return {
      VariableDeclarator(node: VariableDeclaratorNode) {
        if (isIdentifier(node.id)) {
          check('variable', node.id.name, node.id)
        }
      },
      ClassDeclaration(node: ClassDeclarationNode) {
        check('class', node.id?.name ?? null, node.id)
        check('typeLike', node.id?.name ?? null, node.id)
      },
      TSInterfaceDeclaration(node: TSInterfaceDeclarationNode) {
        check('interface', node.id.name, node.id)
        check('typeLike', node.id.name, node.id)
      },
      TSTypeAliasDeclaration(node: TSTypeAliasDeclarationNode) {
        check('typeLike', node.id.name, node.id)
      },
      TSEnumDeclaration(node: TSEnumDeclarationNode) {
        check('typeLike', node.id.name, node.id)
      },
      TSTypeParameter(node: TSTypeParameterNode) {
        check('typeLike', nameFromTypeParameter(node), node)
      },
    }
  },
})
