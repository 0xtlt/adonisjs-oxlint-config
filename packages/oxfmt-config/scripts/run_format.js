import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

import { configOxfmt } from '../dist/index.js'
import { formatEdgeProject } from '../dist/edge/index.js'

const require = createRequire(import.meta.url)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const configPath = join(root, '.oxfmtrc.generated.json')
const extraArgs = process.argv.slice(2)
const check = extraArgs.includes('--check')
const oxfmtBin = join(dirname(require.resolve('oxfmt/package.json')), 'bin/oxfmt')

writeFileSync(configPath, `${JSON.stringify(configOxfmt(), null, 2)}\n`)

const oxfmtResult = spawnSync(process.execPath, [oxfmtBin, '-c', configPath, ...extraArgs, '.'], {
  cwd: root,
  stdio: 'inherit',
})

if ((oxfmtResult.status ?? 1) !== 0) {
  process.exit(oxfmtResult.status ?? 1)
}

const edgeResult = await formatEdgeProject({ cwd: root, check })
if (check && edgeResult.changed.length > 0) {
  console.error('Edge files that need formatting:')
  for (const file of edgeResult.changed) {
    console.error(`  ${file}`)
  }
  process.exit(1)
}

process.exit(0)
