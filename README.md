# adonisjs-oxc-config

Oxlint and Oxfmt presets for AdonisJS applications and packages.

| Package                                                     | Docs                                               |
| ----------------------------------------------------------- | -------------------------------------------------- |
| [`@0xtlt/adonisjs-oxlint-config`](./packages/oxlint-config) | [Oxlint](https://oxc.rs/docs/guide/usage/linter)   |
| [`@0xtlt/adonisjs-oxfmt-config`](./packages/oxfmt-config)   | [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) |

## Installation

```sh
npm i -D @0xtlt/adonisjs-oxlint-config @0xtlt/adonisjs-oxfmt-config oxlint oxfmt
```

## Usage

```ts
// oxlint.config.ts
import { configApp } from '@0xtlt/adonisjs-oxlint-config'

export default configApp()
```

```ts
// oxfmt.config.ts
import { configOxfmt } from '@0xtlt/adonisjs-oxfmt-config'
import { defineConfig } from 'oxfmt'

export default defineConfig(configOxfmt())
```

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt --write && adonisjs-oxfmt-edge --write",
    "format:check": "oxfmt --check && adonisjs-oxfmt-edge --check"
  }
}
```

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
npm run lint
npm run format:check
```
