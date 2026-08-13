import { formatJsSnippet } from './format_js'
import { htmlCategory } from './taxonomy'
import type { EdgeAttribute, EdgeNode } from './parse'
import type { EdgeFormatOptions } from '../types'

const DEFAULT_OPTIONS: EdgeFormatOptions = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  edgeMustacheSpacing: 1,
  edgeAttributeQuotes: 'double',
  edgeBlankLinesInBlocks: 1,
}

export async function printDocument(
  nodes: EdgeNode[],
  options: EdgeFormatOptions = {}
): Promise<string> {
  const resolved = { ...DEFAULT_OPTIONS, ...options }
  const prepared = await prepareNodes(nodes, resolved)
  const body = printNodes(cleanBlockChildren(prepared), 0, resolved).replace(/\s+$/, '')
  return `${body}\n`
}

async function prepareNodes(nodes: EdgeNode[], options: EdgeFormatOptions): Promise<EdgeNode[]> {
  return Promise.all(nodes.map((node) => prepareNode(node, options)))
}

async function prepareNode(node: EdgeNode, options: EdgeFormatOptions): Promise<EdgeNode> {
  switch (node.type) {
    case 'mustache':
      return { ...node, inner: await formatJsSnippet(node.inner, options.printWidth) }
    case 'inline':
    case 'void':
      return {
        ...node,
        args: node.args ? await formatJsSnippet(node.args, options.printWidth) : '',
      }
    case 'block':
      return {
        ...node,
        branches: await Promise.all(
          node.branches.map(async (branch) => ({
            ...branch,
            args: branch.args ? await formatJsSnippet(branch.args, options.printWidth) : '',
            body: await prepareNodes(branch.body, options),
          }))
        ),
      }
    case 'html':
      return {
        ...node,
        attrs: await Promise.all(
          node.attrs.map(async (attr) => ({
            ...attr,
            value:
              attr.value && attr.value.includes('{{')
                ? await formatMustachesInText(attr.value, options)
                : attr.value,
          }))
        ),
        children: await prepareNodes(node.children, options),
      }
    default:
      return node
  }
}

async function formatMustachesInText(value: string, options: EdgeFormatOptions): Promise<string> {
  const matches = [...value.matchAll(/\{\{\{?([\s\S]*?)\}\}\}?/g)]
  let output = value
  for (const match of matches) {
    const inner = match[1]
    if (inner === undefined || match[0] === undefined) {
      continue
    }
    const formatted = await formatJsSnippet(inner, options.printWidth)
    const raw = match[0].startsWith('{{{')
    const open = raw ? '{{{' : '{{'
    const close = raw ? '}}}' : '}}'
    const space = options.edgeMustacheSpacing === 0 ? '' : ' '
    output = output.replace(match[0], `${open}${space}${formatted}${space}${close}`)
  }
  return output
}

function printNodes(nodes: EdgeNode[], indent: number, options: EdgeFormatOptions): string {
  const parts: string[] = []

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    if (!node) {
      continue
    }
    const printed = printNode(node, indent, options)
    if (printed.length === 0) {
      continue
    }
    parts.push(printed)
    const next = nodes[index + 1]
    const blanks = Math.min(nodeBlankCount(node), options.edgeBlankLinesInBlocks ?? 1)
    if (next && blanks > 0 && next.type === 'html' && isHtmlOrEdge(node)) {
      for (let extra = 0; extra < blanks; extra += 1) {
        parts.push('')
      }
    }
  }

  return parts.join('\n')
}

function printNode(node: EdgeNode, indent: number, options: EdgeFormatOptions): string {
  const pad = indent < 0 ? '' : indentString(indent, options)

  switch (node.type) {
    case 'text':
      return node.value.trim() ? `${pad}${node.value.trim()}` : ''
    case 'mustache':
      return `${pad}${printMustache(node.kind, node.inner, options)}`
    case 'comment':
      return `${pad}${printComment(node.inner, options)}`
    case 'inline':
      return `${pad}${printTag(node.name, node.args, false)}`
    case 'void':
      return `${pad}${printTag(node.name, node.args, true)}`
    case 'raw':
      return printRaw(node.body, indent, options)
    case 'block':
      return printBlock(node, indent, options)
    case 'html':
      return printHtml(node, indent, options)
    case 'html-comment':
      return `${pad}<!--${node.value}-->`
    case 'doctype':
      return `${pad}${node.value}`
    default:
      return ''
  }
}

function printMustache(
  kind: 'escaped' | 'raw' | 'literal' | 'literal-raw',
  inner: string,
  options: EdgeFormatOptions
): string {
  const open =
    kind === 'raw' ? '{{{' : kind === 'literal' ? '@{{' : kind === 'literal-raw' ? '@{{{' : '{{'
  const close = kind === 'raw' || kind === 'literal-raw' ? '}}}' : '}}'
  const space = options.edgeMustacheSpacing === 0 ? '' : ' '
  if (inner.includes('\n')) {
    const pad = indentString(1, options)
    const lines = inner.split('\n')
    return `${open}\n${lines.map((line) => `${pad}${line}`).join('\n')}\n${close}`
  }
  return `${open}${space}${inner}${space}${close}`
}

function printComment(inner: string, options: EdgeFormatOptions): string {
  const space = options.edgeMustacheSpacing === 0 ? '' : ' '
  const trimmed = inner.trim()
  if (!trimmed.includes('\n')) {
    return `{{--${trimmed ? `${space}${trimmed}${space}` : space}--}}`
  }
  const pad = indentString(1, options)
  const lines = trimmed.split('\n').map((line) => line.trim())
  return `{{--\n${lines.map((line) => `${pad}${line}`).join('\n')}\n--}}`
}

function printTag(name: string, args: string, isVoid: boolean): string {
  const prefix = isVoid ? '@!' : '@'
  if (!args.includes('\n')) {
    return `${prefix}${name}(${args})`
  }
  return `${prefix}${name}(${args})`
}

function printRaw(body: string, indent: number, options: EdgeFormatOptions): string {
  const pad = indentString(indent, options)
  const trimmed = body.replace(/^\n+|\n+$/g, '')
  if (!trimmed) {
    return `${pad}@raw\n${pad}@end`
  }
  return `${pad}@raw\n${trimmed}\n${pad}@end`
}

function printBlock(
  node: Extract<EdgeNode, { type: 'block' }>,
  indent: number,
  options: EdgeFormatOptions
): string {
  const pad = indentString(indent, options)
  const lines: string[] = []

  for (const branch of node.branches) {
    if (branch.name === 'else' && !branch.args) {
      lines.push(`${pad}@else`)
    } else {
      lines.push(`${pad}@${branch.name}(${branch.args})`)
    }
    const body = cleanBlockChildren(branch.body)
    if (body.length > 0) {
      lines.push(printNodes(body, indent + 1, options))
    }
  }

  lines.push(`${pad}@end`)
  return lines.join('\n')
}

function printHtml(
  node: Extract<EdgeNode, { type: 'html' }>,
  indent: number,
  options: EdgeFormatOptions
): string {
  const pad = indentString(indent, options)
  const category = htmlCategory(node.name)
  const open = printOpenTag(node, options)

  if (category === 'void' || node.selfClosing) {
    return `${pad}${open}`
  }

  const children = node.children
  if (children.length === 0) {
    return `${pad}${open}</${node.name}>`
  }

  const cleaned = cleanChildren(children)
  const anyBlock = cleaned.some(isBlockLevel)

  if (!anyBlock) {
    return `${pad}${open}${printInlineChildren(cleaned, options)}</${node.name}>`
  }

  const inner = printNodes(cleaned, indent + 1, options)
  return `${pad}${open}\n${inner}\n${pad}</${node.name}>`
}

function printOpenTag(
  node: Extract<EdgeNode, { type: 'html' }>,
  options: EdgeFormatOptions
): string {
  const isVoid = htmlCategory(node.name) === 'void' || node.selfClosing
  if (node.attrs.length === 0) {
    return `<${node.name}${isVoid ? ' />' : '>'}`
  }
  const attrs = node.attrs.map((attr) => printAttr(attr, options)).join(' ')
  return `<${node.name} ${attrs}${isVoid ? ' />' : '>'}`
}

function printAttr(attr: EdgeAttribute, options: EdgeFormatOptions): string {
  if (attr.value === null) {
    return attr.name
  }
  const quote = resolveAttrQuote(attr, options)
  return `${attr.name}=${quote}${attr.value}${quote}`
}

function resolveAttrQuote(attr: EdgeAttribute, options: EdgeFormatOptions): '"' | "'" {
  const mode = options.edgeAttributeQuotes ?? 'double'
  let preferred: '"' | "'" = '"'
  if (mode === 'preserve') {
    preferred = attr.quote === "'" ? "'" : '"'
  } else if (mode === 'single') {
    preferred = "'"
  }
  const value = attr.value ?? ''
  if (preferred === '"' && value.includes('"')) {
    return "'"
  }
  if (preferred === "'" && value.includes("'")) {
    return '"'
  }
  return preferred
}

function printInlineChildren(nodes: EdgeNode[], options: EdgeFormatOptions): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        return node.value.trim()
      }
      return printNode(node, -1, options)
    })
    .filter(Boolean)
    .join('')
}

function isBlockLevel(node: EdgeNode): boolean {
  if (
    node.type === 'block' ||
    node.type === 'raw' ||
    node.type === 'inline' ||
    node.type === 'void'
  ) {
    return true
  }
  if (node.type === 'html') {
    const category = htmlCategory(node.name)
    return category === 'block' || category === 'void' || category === 'raw'
  }
  return node.type === 'html-comment' || node.type === 'doctype'
}

function isHtmlOrEdge(node: EdgeNode): boolean {
  return (
    node.type === 'html' || node.type === 'block' || node.type === 'inline' || node.type === 'void'
  )
}

function isWhitespaceText(node: EdgeNode): node is Extract<EdgeNode, { type: 'text' }> {
  return node.type === 'text' && /^\s*$/.test(node.value)
}

function cleanChildren(nodes: EdgeNode[]): EdgeNode[] {
  if (nodes.some(isBlockLevel)) {
    return cleanBlockChildren(nodes)
  }
  return nodes.filter((node) => !(node.type === 'text' && node.value.trim() === ''))
}

function cleanBlockChildren(nodes: EdgeNode[]): EdgeNode[] {
  const output: EdgeNode[] = []

  for (const node of nodes) {
    if (isWhitespaceText(node)) {
      const blanks = Math.max(0, (node.value.match(/\n/g) ?? []).length - 1)
      const previous = output[output.length - 1]
      if (previous && blanks > 0 && 'blankCount' in previous === false) {
        Object.assign(previous, { blankCount: blanks })
      }
      continue
    }
    output.push(node)
  }

  return output
}

function nodeBlankCount(node: EdgeNode): number {
  return (node as EdgeNode & { blankCount?: number }).blankCount ?? 0
}

function indentString(level: number, options: EdgeFormatOptions): string {
  const unit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth ?? 2)
  return unit.repeat(Math.max(0, level))
}
