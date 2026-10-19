import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';

export default defineConfig({
  base: '/petasuara/',
  build: { target: 'es2022' },
  plugins: [{
    name: 'ship-static-datasets',
    closeBundle() {
      mkdirSync('dist/data', { recursive: true });
      for (const name of ['pilpres-2024.json', 'dpr-ri-2024.json', 'indonesia-38-provinces.topo.json']) {
        cpSync('data/' + name, 'dist/data/' + name);
      }
    }
  }]
});
