# @0xtlt/adonisjs-oxfmt-config

> Compatible with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)

A TypeScript rebuild of [`@adonisjs/prettier-config`](https://github.com/adonisjs/prettier-config) for the Oxc formatter.

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

Or import the preset object directly:

```ts
import config from '@0xtlt/adonisjs-oxfmt-config'
import { defineConfig } from 'oxfmt'

export default defineConfig(config)
```

Add scripts:

```json
{
  "scripts": {
    "format": "oxfmt --write",
    "format:check": "oxfmt --check"
  }
}
```

### Extra options

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

| Original Prettier option             | Oxfmt handling                           |
| ------------------------------------ | ---------------------------------------- |
| `trailingComma: "es5"`               | Same                                     |
| `semi: false`                        | Same                                     |
| `singleQuote: true`                  | Same                                     |
| `useTabs: false`                     | Same                                     |
| `quoteProps: "consistent"`           | Same                                     |
| `bracketSpacing: true`               | Same                                     |
| `arrowParens: "always"`              | Same                                     |
| `printWidth: 100`                    | Same                                     |
| `plugins: [prettier-edge]`           | Not supported. `.edge` files are ignored |
| Oxfmt `sortPackageJson` (default on) | Disabled to match Prettier               |
| Oxfmt `sortImports`                  | Disabled to match Prettier               |

Oxfmt does not load Prettier plugins. Keep Prettier + `prettier-edge` if you still format Edge templates.

## Development

From the repository root:

```sh
npm install
npm test
npm run format:check
```
