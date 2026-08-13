import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

import { configPkg } from '../dist/index.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const configPath = join(root, '.oxlintrc.generated.json')
const extraArgs = process.argv.slice(2)

writeFileSync(configPath, `${JSON.stringify(configPkg(), null, 2)}\n`)

const result = spawnSync(
  process.execPath,
  [join(root, 'node_modules/oxlint/bin/oxlint'), '-c', configPath, ...extraArgs, '.'],
  {
    cwd: root,
    stdio: 'inherit',
  }
)

process.exit(result.status ?? 1)
