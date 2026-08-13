export interface RuleFixer {
  replaceText(node: unknown, text: string): unknown
  remove(node: unknown): unknown
  insertTextAfter(node: unknown, text: string): unknown
  insertTextBefore(node: unknown, text: string): unknown
}

export interface ReportDescriptor {
  node: unknown
  messageId?: string
  message?: string
  data?: Record<string, string>
  fix?: (fixer: RuleFixer) => unknown
}

export interface RuleContext<Options extends unknown[] = unknown[]> {
  filename: string
  options: Options
  sourceCode: {
    text: string
    getText(node?: unknown): string
  }
  report(descriptor: ReportDescriptor): void
}

export interface RuleMeta {
  type: 'problem' | 'suggestion' | 'layout'
  docs: {
    description: string
  }
  schema: unknown[]
  messages: Record<string, string>
  fixable?: 'code' | 'whitespace'
}

export interface RuleModule<Options extends unknown[] = unknown[]> {
  meta: RuleMeta
  create(context: RuleContext<Options>): Record<string, ((node: any) => void) | undefined>
}

export interface Plugin {
  meta: { name: string }
  rules: Record<string, RuleModule<any>>
}

export function createRule<Options extends unknown[] = unknown[]>(rule: RuleModule<Options>): RuleModule<Options> {
  return rule
}
