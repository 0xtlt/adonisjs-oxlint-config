# adonisjs-oxc-config

Oxlint and Oxfmt presets rebuilt from the AdonisJS ESLint and Prettier configs.

| Package                                                     | Replaces                                                                   | Docs                                               |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| [`@0xtlt/adonisjs-oxlint-config`](./packages/oxlint-config) | [`@adonisjs/eslint-config`](https://github.com/adonisjs/eslint-config)     | [Oxlint](https://oxc.rs/docs/guide/usage/linter)   |
| [`@0xtlt/adonisjs-oxfmt-config`](./packages/oxfmt-config)   | [`@adonisjs/prettier-config`](https://github.com/adonisjs/prettier-config) | [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) |

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
    "format": "oxfmt --write",
    "format:check": "oxfmt --check"
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
