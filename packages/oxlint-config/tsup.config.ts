import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'frameworks/vue': 'src/frameworks/vue.ts',
    'frameworks/react': 'src/frameworks/react.ts',
    'plugin/index': 'src/plugin/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'node20',
  outDir: 'dist',
})
