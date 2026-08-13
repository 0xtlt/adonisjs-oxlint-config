import { describe, expect, it } from 'vitest'

import { EDGE_EXTENSIONS, EDGE_OPTIONS, configEdge, formatEdge } from '../src/index'

describe('configEdge', () => {
  it('uses the AdonisJS Oxfmt options for Edge templates', () => {
    expect(EDGE_OPTIONS).toMatchObject({
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      edgeMustacheSpacing: 1,
    })
  })

  it('merges extra Edge options on top of the preset', () => {
    expect(configEdge({ printWidth: 80 }).printWidth).toBe(80)
    expect(configEdge({ printWidth: 80 }).tabWidth).toBe(2)
  })

  it('lists the Edge extensions the printer owns', () => {
    expect(EDGE_EXTENSIONS).toEqual(['.edge', '.edgejs'])
  })
})

describe('formatEdge', () => {
  it('formats Edge tags, HTML, and mustaches', async () => {
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

  it('formats JavaScript inside mustaches with the AdonisJS quote options', async () => {
    const formatted = await formatEdge(`<p>{{user["name"]}}</p>\n`)

    expect(formatted).toContain("{{ user['name'] }}")
    expect(formatted.includes(';')).toBe(false)
  })
})
