import {resolve} from 'path';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/vue/index.ts'),
      formats: ['umd'],
      name: 'vue',
      fileName: () => 'vue.js',
    },
    outDir: resolve(__dirname, 'html/dist'),
    emptyOutDir: false,
  },
  plugins: [vue()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
