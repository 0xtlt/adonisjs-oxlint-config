# @0xtlt/adonisjs-oxlint-config

> Compatible with [Oxlint](https://oxc.rs/docs/guide/usage/linter)

<hr>
<br />

<div align="center">
  <h3>Oxlint presets used by AdonisJS applications and packages</h3>
  <p>
    A TypeScript Oxlint preset for AdonisJS applications and packages. Native
    Oxlint plugins plus a small JS plugin for AdonisJS-specific rules.
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

## Rules

The preset enables an explicit AdonisJS rule list on native Oxlint plugins plus bundled `@adonisjs/*` rules. Oxlint categories are turned **off** so only that list runs.

Formatting is out of scope. Use [`@0xtlt/adonisjs-oxfmt-config`](../oxfmt-config).

Vue overlays cover script-block rules that exist natively (`define-emits-declaration`, `define-props-declaration`, `component-definition-name-casing`). React overlays cover the native `react` plugin, including hooks.

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
    for <a href="https://oxc.rs/docs/guide/usage/linter">Oxlint</a>.
  </sub>
</div>
