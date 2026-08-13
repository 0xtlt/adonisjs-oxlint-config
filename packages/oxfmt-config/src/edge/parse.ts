import { INLINE_TAGS, RAW_HTML, VOID_HTML } from './taxonomy'

export type MustacheKind = 'escaped' | 'raw' | 'literal' | 'literal-raw'

export interface EdgeAttribute {
  name: string
  value: string | null
  quote: '"' | "'" | ''
}

export interface EdgeBranch {
  name: string
  args: string
  body: EdgeNode[]
}

export type EdgeNode =
  | { type: 'text'; value: string }
  | { type: 'mustache'; kind: MustacheKind; inner: string }
  | { type: 'comment'; inner: string }
  | { type: 'inline'; name: string; args: string }
  | { type: 'void'; name: string; args: string }
  | { type: 'block'; branches: EdgeBranch[] }
  | { type: 'raw'; body: string }
  | {
      type: 'html'
      name: string
      attrs: EdgeAttribute[]
      selfClosing: boolean
      children: EdgeNode[]
    }
  | { type: 'html-comment'; value: string }
  | { type: 'doctype'; value: string }

class Scanner {
  index = 0

  constructor(readonly source: string) {}

  get eof(): boolean {
    return this.index >= this.source.length
  }

  peek(): string {
    return this.source[this.index] ?? ''
  }

  startsWith(value: string): boolean {
    return this.source.startsWith(value, this.index)
  }

  next(): string {
    const char = this.source[this.index] ?? ''
    this.index += 1
    return char
  }

  take(count: number): string {
    const value = this.source.slice(this.index, this.index + count)
    this.index += value.length
    return value
  }

  takeWhile(predicate: (char: string) => boolean): string {
    const start = this.index
    while (!this.eof && predicate(this.peek())) {
      this.index += 1
    }
    return this.source.slice(start, this.index)
  }

  skipSpaces(): void {
    this.takeWhile((char) => char === ' ' || char === '\t')
  }
}

export function parseEdge(source: string): EdgeNode[] {
  const scanner = new Scanner(source)
  return parseNodes(scanner, () => scanner.eof)
}

function parseNodes(scanner: Scanner, stop: () => boolean): EdgeNode[] {
  const nodes: EdgeNode[] = []

  while (!scanner.eof && !stop()) {
    const node = parseNode(scanner, stop)
    if (!node) {
      break
    }
    nodes.push(node)
  }

  return nodes
}

function parseNode(scanner: Scanner, stop: () => boolean): EdgeNode | null {
  if (stop()) {
    return null
  }

  if (scanner.startsWith('{{--')) {
    return parseEdgeComment(scanner)
  }
  if (scanner.startsWith('@{{{')) {
    return parseMustache(scanner, 'literal-raw', '@{{{', '}}}')
  }
  if (scanner.startsWith('@{{')) {
    return parseMustache(scanner, 'literal', '@{{', '}}')
  }
  if (scanner.startsWith('{{{')) {
    return parseMustache(scanner, 'raw', '{{{', '}}}')
  }
  if (scanner.startsWith('{{')) {
    return parseMustache(scanner, 'escaped', '{{', '}}')
  }
  if (scanner.startsWith('@')) {
    return parseEdgeConstruct(scanner)
  }
  if (scanner.startsWith('<!--')) {
    return parseHtmlComment(scanner)
  }
  if (scanner.startsWith('<!')) {
    return parseDoctype(scanner)
  }
  if (scanner.startsWith('</')) {
    return null
  }
  if (scanner.peek() === '<') {
    return parseHtml(scanner)
  }

  return parseText(scanner)
}

function parseText(scanner: Scanner): EdgeNode {
  const start = scanner.index
  while (!scanner.eof) {
    if (scanner.startsWith('{{') || scanner.startsWith('@') || scanner.peek() === '<') {
      break
    }
    scanner.next()
  }
  return { type: 'text', value: scanner.source.slice(start, scanner.index) }
}

function parseMustache(
  scanner: Scanner,
  kind: MustacheKind,
  open: string,
  close: string
): EdgeNode {
  scanner.take(open.length)
  const inner = readUntil(scanner, close)
  scanner.take(close.length)
  return { type: 'mustache', kind, inner }
}

function parseEdgeComment(scanner: Scanner): EdgeNode {
  scanner.take(4)
  const inner = readUntil(scanner, '--}}')
  scanner.take(4)
  return { type: 'comment', inner }
}

function parseHtmlComment(scanner: Scanner): EdgeNode {
  scanner.take(4)
  const value = readUntil(scanner, '-->')
  scanner.take(3)
  return { type: 'html-comment', value }
}

function parseDoctype(scanner: Scanner): EdgeNode {
  const start = scanner.index
  while (!scanner.eof && scanner.peek() !== '>') {
    scanner.next()
  }
  scanner.next()
  return { type: 'doctype', value: scanner.source.slice(start, scanner.index) }
}

function parseEdgeConstruct(scanner: Scanner): EdgeNode | null {
  if (matchKeyword(scanner, '@end')) {
    return null
  }
  if (matchKeyword(scanner, '@else') || matchKeyword(scanner, '@elseif')) {
    return null
  }

  if (matchKeyword(scanner, '@raw')) {
    return parseRawBlock(scanner)
  }

  const selfClosed = scanner.startsWith('@!')
  scanner.take(selfClosed ? 2 : 1)
  const name = scanner.takeWhile((char) => /[\w.-]/.test(char))
  if (!name) {
    return { type: 'text', value: selfClosed ? '@!' : '@' }
  }

  let args = ''
  scanner.skipSpaces()
  if (scanner.peek() === '(') {
    args = readBalanced(scanner, '(', ')')
  }

  if (selfClosed || INLINE_TAGS.has(name.split('.')[0] ?? name)) {
    return { type: selfClosed ? 'void' : 'inline', name, args }
  }

  const branches: EdgeBranch[] = [{ name, args, body: [] }]
  branches[0]!.body = parseNodes(scanner, () => isBranchOrEnd(scanner))

  while (matchKeyword(scanner, '@elseif') || matchKeyword(scanner, '@else')) {
    const branchName = scanner.startsWith('@elseif') ? 'elseif' : 'else'
    scanner.take(branchName === 'elseif' ? 7 : 5)
    scanner.skipSpaces()
    const branchArgs = scanner.peek() === '(' ? readBalanced(scanner, '(', ')') : ''
    const body = parseNodes(scanner, () => isBranchOrEnd(scanner))
    branches.push({ name: branchName, args: branchArgs, body })
  }

  if (matchKeyword(scanner, '@end')) {
    scanner.take(4)
  }

  return { type: 'block', branches }
}

function parseRawBlock(scanner: Scanner): EdgeNode {
  scanner.take(4)
  const body = readUntilKeyword(scanner, '@end')
  if (matchKeyword(scanner, '@end')) {
    scanner.take(4)
  }
  return { type: 'raw', body }
}

function parseHtml(scanner: Scanner): EdgeNode {
  scanner.next()
  const name = scanner.takeWhile((char) => /[\w:-]/.test(char))
  const attrs = parseAttrs(scanner)
  scanner.skipSpaces()

  const selfClosing = scanner.startsWith('/>')
  if (selfClosing) {
    scanner.take(2)
    return { type: 'html', name, attrs, selfClosing: true, children: [] }
  }

  if (scanner.peek() === '>') {
    scanner.next()
  }

  const lower = name.toLowerCase()
  if (VOID_HTML.has(lower)) {
    return { type: 'html', name, attrs, selfClosing: true, children: [] }
  }

  if (RAW_HTML.has(lower)) {
    const inner = readUntil(scanner, `</${name}`)
    if (scanner.startsWith(`</${name}`)) {
      scanner.take(2 + name.length)
      scanner.skipSpaces()
      if (scanner.peek() === '>') {
        scanner.next()
      }
    }
    return {
      type: 'html',
      name,
      attrs,
      selfClosing: false,
      children: inner ? [{ type: 'text', value: inner }] : [],
    }
  }

  const children = parseNodes(
    scanner,
    () =>
      scanner.startsWith(`</${name}`) ||
      scanner.startsWith(`</${name.toLowerCase()}`) ||
      isBranchOrEnd(scanner)
  )
  if (scanner.startsWith('</')) {
    scanner.take(2)
    scanner.takeWhile((char) => /[\w:-]/.test(char))
    scanner.skipSpaces()
    if (scanner.peek() === '>') {
      scanner.next()
    }
  }

  return { type: 'html', name, attrs, selfClosing: false, children }
}

function parseAttrs(scanner: Scanner): EdgeAttribute[] {
  const attrs: EdgeAttribute[] = []

  while (!scanner.eof && scanner.peek() !== '>' && !scanner.startsWith('/>')) {
    if (!/\s/.test(scanner.peek())) {
      break
    }
    scanner.takeWhile((char) => /\s/.test(char))
    if (scanner.peek() === '>' || scanner.startsWith('/>') || scanner.eof) {
      break
    }

    const name = scanner.takeWhile((char) => /[^\s=>/]/.test(char))
    if (!name) {
      scanner.next()
      continue
    }

    scanner.skipSpaces()
    if (scanner.peek() !== '=') {
      attrs.push({ name, value: null, quote: '' })
      continue
    }

    scanner.next()
    scanner.skipSpaces()
    const quote = scanner.peek() === '"' || scanner.peek() === "'" ? scanner.next() : ''
    if (quote) {
      const value = readUntil(scanner, quote)
      scanner.take(quote.length)
      attrs.push({ name, value, quote: quote as '"' | "'" })
    } else {
      const value = scanner.takeWhile((char) => !/\s/.test(char) && char !== '>')
      attrs.push({ name, value, quote: '' })
    }
  }

  return attrs
}

function isBranchOrEnd(scanner: Scanner): boolean {
  return (
    matchKeyword(scanner, '@end') ||
    matchKeyword(scanner, '@else') ||
    matchKeyword(scanner, '@elseif')
  )
}

function matchKeyword(scanner: Scanner, keyword: string): boolean {
  if (!scanner.startsWith(keyword)) {
    return false
  }
  const next = scanner.source[scanner.index + keyword.length] ?? ''
  return next === '' || /[\s(/]/.test(next)
}

function readUntil(scanner: Scanner, close: string): string {
  const start = scanner.index
  while (!scanner.eof && !scanner.startsWith(close)) {
    scanner.next()
  }
  return scanner.source.slice(start, scanner.index)
}

function readUntilKeyword(scanner: Scanner, keyword: string): string {
  const start = scanner.index
  while (!scanner.eof && !matchKeyword(scanner, keyword)) {
    scanner.next()
  }
  return scanner.source.slice(start, scanner.index)
}

function readBalanced(scanner: Scanner, open: string, close: string): string {
  scanner.take(open.length)
  const start = scanner.index
  let depth = 1

  while (!scanner.eof && depth > 0) {
    const char = scanner.peek()
    if (char === '"' || char === "'" || char === '`') {
      const quote = scanner.next()
      while (!scanner.eof && scanner.peek() !== quote) {
        if (scanner.peek() === '\\') {
          scanner.next()
        }
        scanner.next()
      }
      scanner.next()
      continue
    }
    if (scanner.startsWith(open)) {
      depth += 1
      scanner.take(open.length)
      continue
    }
    if (scanner.startsWith(close)) {
      depth -= 1
      if (depth === 0) {
        const inner = scanner.source.slice(start, scanner.index)
        scanner.take(close.length)
        return inner.trim()
      }
      scanner.take(close.length)
      continue
    }
    scanner.next()
  }

  return scanner.source.slice(start, scanner.index).trim()
}
