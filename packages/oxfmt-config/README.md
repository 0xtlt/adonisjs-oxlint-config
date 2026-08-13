# @0xtlt/adonisjs-oxfmt-config

> Compatible with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)

A TypeScript rebuild of [`@adonisjs/prettier-config`](https://github.com/adonisjs/prettier-config) for the Oxc formatter, plus [`prettier-edge`](https://github.com/edge-js/prettier-plugin-edge) for Edge templates.

## Installation

```sh
npm i -D @0xtlt/adonisjs-oxfmt-config oxfmt
```

Oxfmt TypeScript config files (`oxfmt.config.ts`) need Node.js `^20.19.0` or `>=22.18.0`.

## Usage

```ts
// oxfmt.config.ts
import { configOxfmt } from '@0xtlt/adonisjs-oxfmt-config'
import { defineConfig } from 'oxfmt'

export default defineConfig(configOxfmt())
```

Oxfmt cannot load Prettier plugins. Edge templates are formatted with the bundled `prettier-edge` CLI:

```json
{
  "scripts": {
    "format": "oxfmt --write && adonisjs-oxfmt-edge --write",
    "format:check": "oxfmt --check && adonisjs-oxfmt-edge --check"
  }
}
```

Or call the same formatter from TypeScript:

```ts
import { formatEdge } from '@0xtlt/adonisjs-oxfmt-config'

const formatted = await formatEdge(`@if(user)\n<p>{{user.name}}</p>\n@end\n`)
```

### Extra Oxfmt options

```ts
import { configOxfmt } from '@0xtlt/adonisjs-oxfmt-config'
import { defineConfig } from 'oxfmt'

export default defineConfig(
  configOxfmt({
    printWidth: 80,
    ignorePatterns: ['tmp/**'],
  })
)
```

## What changed from Prettier

| Original Prettier option             | Handling                                          |
| ------------------------------------ | ------------------------------------------------- |
| `trailingComma: "es5"`               | Same in Oxfmt and prettier-edge                   |
| `semi: false`                        | Same                                              |
| `singleQuote: true`                  | Same                                              |
| `useTabs: false`                     | Same                                              |
| `quoteProps: "consistent"`           | Same                                              |
| `bracketSpacing: true`               | Same                                              |
| `arrowParens: "always"`              | Same                                              |
| `printWidth: 100`                    | Same                                              |
| `plugins: [prettier-edge]`           | Bundled as `adonisjs-oxfmt-edge` / `formatEdge()` |
| Oxfmt `sortPackageJson` (default on) | Disabled to match Prettier                        |
| Oxfmt `sortImports`                  | Disabled to match Prettier                        |

## Not ported

- Loading `prettier-edge` _inside_ Oxfmt. Oxfmt has no Prettier plugin API yet, so `.edge` files are ignored by `configOxfmt()` and formatted by the companion CLI.
- Byte-identical Prettier output for JS/TS. Oxfmt is Prettier-compatible, not a Prettier clone.
- `prettier/prettier` `endOfLine: "auto"` from the ESLint preset. Oxfmt uses `lf`.

## Development

From the repository root:

```sh
npm install
npm test
npm run format:check
```
