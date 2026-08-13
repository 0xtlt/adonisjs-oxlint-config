# @0xtlt/adonisjs-oxlint-config

> Compatible with [Oxlint](https://oxc.rs/docs/guide/usage/linter)

<hr>
<br />

<div align="center">
  <h3>Oxlint presets used by AdonisJS applications and packages</h3>
  <p>
    A TypeScript rebuild of <a href="https://github.com/adonisjs/eslint-config"><code>@adonisjs/eslint-config</code></a>
    for the Oxc linter. The presets keep the original AdonisJS rule intent, mapped onto native Oxlint plugins
    plus a small JS plugin for AdonisJS-specific rules.
  </p>
</div>

<br />

## Installation

```sh
npm i -D @0xtlt/adonisjs-oxlint-config oxlint
```

Oxlint TypeScript config files (`oxlint.config.ts`) need Node.js `^20.19.0` or `>=22.18.0`.

## Usage

**For package development**

```ts
// oxlint.config.ts
import { configPkg } from '@0xtlt/adonisjs-oxlint-config'

export default configPkg()
```

**For AdonisJS application development**

```ts
// oxlint.config.ts
import { configApp } from '@0xtlt/adonisjs-oxlint-config'

export default configApp()
```

Add scripts:

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

### Vue

```ts
import { configApp } from '@0xtlt/adonisjs-oxlint-config'
import { vue } from '@0xtlt/adonisjs-oxlint-config/vue'

export default configApp(vue)
```

### React

```ts
import { configApp } from '@0xtlt/adonisjs-oxlint-config'
import { react } from '@0xtlt/adonisjs-oxlint-config/react'

export default configApp(react)
```

### Inertia support

If `@adonisjs/inertia` is installed, the following rules are enabled for files in `inertia/**`:

- `@adonisjs/no-backend-import-in-frontend`
- `@adonisjs/prefer-adonisjs-inertia-link`
- `@adonisjs/prefer-adonisjs-inertia-form`

### Extra config blocks

```ts
import { configApp, INCLUDE_LIST, GLOBAL_IGNORE_LIST } from '@0xtlt/adonisjs-oxlint-config'

export default configApp({
  ignorePatterns: [...GLOBAL_IGNORE_LIST, 'tmp/**'],
  rules: {
    'no-debugger': 'off',
  },
  overrides: [
    {
      files: INCLUDE_LIST,
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ],
})
```

## What changed from ESLint

| Original ESLint preset                              | Oxlint preset                                                   |
| --------------------------------------------------- | --------------------------------------------------------------- |
| ESLint core rules                                   | Native `eslint/*` rules                                         |
| `typescript-eslint`                                 | Native `typescript/*` rules                                     |
| `eslint-plugin-unicorn`                             | Native `unicorn/*` rules                                        |
| `@adonisjs/eslint-plugin`                           | Bundled Oxlint JS plugin (`@adonisjs/*`)                        |
| `eslint-plugin-vue`                                 | Native `vue` plugin (script blocks)                             |
| `eslint-plugin-react` + `eslint-plugin-react-hooks` | Native `react` plugin                                           |
| `@stylistic/eslint-plugin` + Prettier               | Omitted (use [`@0xtlt/adonisjs-oxfmt-config`](../oxfmt-config)) |

Formatting is out of scope for Oxlint. Use [`@0xtlt/adonisjs-oxfmt-config`](../oxfmt-config) (Oxfmt port of `@adonisjs/prettier-config`).

### Rule compatibility

| Original rule                                                                                                           | Oxlint handling                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/consistent-type-imports`                                                                            | `typescript/consistent-type-imports`                                                              |
| `@typescript-eslint/no-shadow`                                                                                          | `no-shadow`                                                                                       |
| `@typescript-eslint/naming-convention`                                                                                  | `@adonisjs/naming-convention` (same AdonisJS selectors)                                           |
| `unicorn/prefer-module`                                                                                                 | `unicorn/prefer-module`                                                                           |
| `unicorn/filename-case`                                                                                                 | `unicorn/filename-case` (`snakeCase`)                                                             |
| `unicorn/no-for-loop`                                                                                                   | `@adonisjs/no-for-loop` (removed upstream from Unicorn)                                           |
| `no-undef-init`                                                                                                         | `@adonisjs/no-undef-init`                                                                         |
| `one-var`                                                                                                               | Native `one-var`                                                                                  |
| `handle-callback-err`                                                                                                   | `node/handle-callback-err`                                                                        |
| `@stylistic/*`, `prettier/prettier`                                                                                     | Not ported (formatters, not linters)                                                              |
| `vue/block-order`, `vue/component-api-style`, `vue/multi-word-component-names`, `vue/component-name-in-template-casing` | Not available in native Oxlint Vue yet; `vue/component-definition-name-casing` is enabled instead |

Oxlint categories are turned **off** so the preset stays a faithful rebuild of the original explicit rule list, rather than enabling Oxlint's default `correctness` set.

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
npm run lint
```

<div align="center">
  <sub>
    Rebuilt from <a href="https://github.com/adonisjs/eslint-config">adonisjs/eslint-config</a>
    for <a href="https://oxc.rs/docs/guide/usage/linter">Oxlint</a>.
  </sub>
</div>
