import { format } from 'oxfmt'

export async function formatJsSnippet(source: string, printWidth = 100): Promise<string> {
  const trimmed = source.trim()
  if (!trimmed) {
    return ''
  }

  const attempts = [trimmed, `(${trimmed})`]

  for (const attempt of attempts) {
    const wrapped = attempt !== trimmed
    const result = await format('snippet.js', attempt, {
      semi: false,
      singleQuote: true,
      trailingComma: 'es5',
      quoteProps: 'consistent',
      bracketSpacing: true,
      arrowParens: 'always',
      printWidth,
      tabWidth: 2,
      useTabs: false,
      endOfLine: 'lf',
    })

    if (result.errors.length > 0) {
      continue
    }

    let code = result.code.replace(/\n$/, '').trim()
    if (code.startsWith(';')) {
      code = code.slice(1).trim()
    }
    if (wrapped && code.startsWith('(') && code.endsWith(')')) {
      code = code.slice(1, -1).trim()
    }

    return code
  }

  return trimmed
}
