import { describe, expect, it } from 'vitest'

import {
  EDGE_EXTENSIONS,
  EDGE_OPTIONS,
  configEdge,
  formatEdge,
  prettierEdgePluginPath,
} from '../src/index'

describe('configEdge', () => {
  it('uses the same AdonisJS Prettier options as the original prettier-config', () => {
    expect(EDGE_OPTIONS).toMatchObject({
      trailingComma: 'es5',
      semi: false,
      singleQuote: true,
      useTabs: false,
      quoteProps: 'consistent',
      bracketSpacing: true,
      arrowParens: 'always',
      printWidth: 100,
    })
  })

  it('points Prettier at the prettier-edge plugin', () => {
    const config = configEdge()

    expect(config.parser).toBe('edge')
    expect(config.plugins).toEqual([prettierEdgePluginPath()])
    expect(prettierEdgePluginPath()).toMatch(/prettier-edge/)
  })

  it('lists the Edge extensions prettier-edge owns', () => {
    expect(EDGE_EXTENSIONS).toEqual(['.edge', '.edgejs'])
  })
})

describe('formatEdge', () => {
  it('formats Edge tags, HTML, and mustaches like prettier-edge', async () => {
    const formatted = await formatEdge(`@if(showFooter)
<footer class="border-t">
@each(section in sections)
<h3>{{section.title}}</h3>
@end
</footer>
@end
`)

    expect(formatted).toBe(`@if(showFooter)
  <footer class="border-t">
    @each(section in sections)
      <h3>{{ section.title }}</h3>
    @end
  </footer>
@end
`)
  })

  it('formats JavaScript inside mustaches with the AdonisJS quote/semi options', async () => {
    const formatted = await formatEdge(`<p>{{user["name"]}}</p>\n`)

    expect(formatted).toContain("{{ user['name'] }}")
    expect(formatted.includes(';')).toBe(false)
  })
})
