import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
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
    terser(),
  ],
};
