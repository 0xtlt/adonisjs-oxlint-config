export const BLOCK_TAGS = new Set([
  'if',
  'unless',
  'each',
  'component',
  'slot',
  'pushTo',
  'pushOnceTo',
  'pushToTop',
  'pushOnceToTop',
  'inputError',
  'can',
  'cannot',
  'error',
])

export const BRANCH_TAGS = new Set(['else', 'elseif'])

export const INLINE_TAGS = new Set([
  'let',
  'assign',
  'include',
  'includeIf',
  'inject',
  'eval',
  'stack',
  'markdown',
  'newError',
  'svg',
  'markdownSlot',
  'vite',
  'flashMessage',
  'flashMessages',
  'dd',
  'dump',
  'viteReactRefresh',
])

export const CLOSER = 'end'

export const VOID_HTML = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

export const RAW_HTML = new Set(['script', 'style', 'pre', 'textarea'])

export const BLOCK_HTML = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'details',
  'dialog',
  'div',
  'dl',
  'dt',
  'dd',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'html',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'section',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'ul',
  'body',
  'head',
  'menu',
  'summary',
  'colgroup',
  'caption',
  'noscript',
  'svg',
  'g',
  'defs',
  'symbol',
  'mask',
  'clippath',
  'pattern',
  'lineargradient',
  'radialgradient',
  'filter',
  'marker',
  'foreignobject',
  'path',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'rect',
  'text',
  'tspan',
  'image',
  'use',
  'stop',
])

export function htmlCategory(name: string): 'void' | 'raw' | 'block' | 'inline' {
  const lower = name.toLowerCase()
  if (VOID_HTML.has(lower)) {
    return 'void'
  }
  if (RAW_HTML.has(lower)) {
    return 'raw'
  }
  if (BLOCK_HTML.has(lower)) {
    return 'block'
  }
  return 'inline'
}

export function classifyEdgeTag(
  name: string,
  selfClosed: boolean
): 'void' | 'block' | 'branch' | 'inline' {
  if (selfClosed) {
    return 'void'
  }
  const head = name.split('.')[0] ?? name
  if (BLOCK_TAGS.has(head)) {
    return 'block'
  }
  if (BRANCH_TAGS.has(head)) {
    return 'branch'
  }
  if (INLINE_TAGS.has(head)) {
    return 'inline'
  }
  return 'block'
}
