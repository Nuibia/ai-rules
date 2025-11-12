import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node18',
  dts: true,
  sourcemap: true,
  clean: true,
  shims: false,
  skipNodeModulesBundle: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  onSuccess: 'node ./scripts/copy-templates.cjs',
});

