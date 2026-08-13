import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'edge/index': 'src/edge/index.ts',
    'cli/edge': 'src/cli/edge.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'node20',
  outDir: 'dist',
  external: ['oxfmt'],
})
