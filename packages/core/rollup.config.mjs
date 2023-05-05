import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: '../../tsconfig.json',
      compilerOptions: {
        outDir: 'dist',
        declaration: true,
        declarationDir: 'dist/types',
      },
    }),
    nodeResolve(),
    commonjs(),
  ],
};