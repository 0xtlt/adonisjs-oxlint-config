# @0xtlt/adonisjs-oxfmt-config

> Compatible with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)

Oxfmt presets for AdonisJS applications and packages, plus a native Edge template printer.

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

Edge templates are formatted by the bundled printer:

```json
{
  "scripts": {
    "format": "oxfmt --write && adonisjs-oxfmt-edge --write",
    "format:check": "oxfmt --check && adonisjs-oxfmt-edge --check"
  }
}
```

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

## Options

`semi: false`, `singleQuote: true`, `printWidth: 100`, `trailingComma: 'es5'`, `quoteProps: 'consistent'`, `sortPackageJson: false`, `sortImports: false`.

`.edge` / `.edgejs` files are ignored by `configOxfmt()` and handled by `formatEdge()`.

## Development

From the repository root:

```sh
npm install
npm test
npm run format:check
```
