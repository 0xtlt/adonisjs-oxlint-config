#!/usr/bin/env node

import { formatEdgeProject } from '../edge/format'

const args = process.argv.slice(2)
const check = args.includes('--check')
const paths = args.filter((arg) => arg !== '--check' && arg !== '--write')

const result = await formatEdgeProject({
  check,
  paths: paths.length > 0 ? paths : undefined,
})

if (check) {
  if (result.changed.length === 0) {
    if (result.checked > 0) {
      console.log(`All ${result.checked} Edge files use the correct format.`)
    }
    process.exit(0)
  }

  console.error('Edge files that need formatting:')
  for (const file of result.changed) {
    console.error(`  ${file}`)
  }
  process.exit(1)
}

if (result.changed.length > 0) {
  console.log(`Formatted ${result.changed.length} Edge file(s).`)
}
