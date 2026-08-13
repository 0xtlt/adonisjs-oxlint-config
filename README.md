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
    "format": "oxfmt --write && adonisjs-oxfmt-edge --write",
    "format:check": "oxfmt --check && adonisjs-oxfmt-edge --check"
  }
}
```

## Not ported

This is an Oxc rebuild, not a 1:1 ESLint/Prettier clone.

### Oxlint (`@0xtlt/adonisjs-oxlint-config`)

- `@stylistic/*` and `prettier/prettier` — formatters, not linters
- `configApp()` `experimentalDecorators` / `emitDecoratorMetadata` parser options
- Vue `flat/recommended` and template-AST rules: `vue/block-order`, `vue/component-api-style`, `vue/component-name-in-template-casing`, `vue/multi-word-component-names`
- Full `@typescript-eslint/naming-convention` — only the AdonisJS selectors are reimplemented
- ESLint `files: ['**/*.ts']` scoping — Oxlint applies the preset more broadly, with ignore lists
- Identical ESLint diagnostic text and autofix coverage

### Oxfmt (`@0xtlt/adonisjs-oxfmt-config`)

- Loading `prettier-edge` as an Oxfmt plugin (Oxfmt has no plugin API). Edge files are formatted by `adonisjs-oxfmt-edge` instead
- Byte-identical Prettier printer output for JS/TS
- `endOfLine: "auto"` from `eslint-plugin-prettier` — Oxfmt uses `lf`

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
npm run lint
npm run format:check
```
