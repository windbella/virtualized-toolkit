import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/core.ts',
    output: [
      {
        file: 'dist/core.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: '../../tsconfig.json',
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/react.tsx',
    output: [
      {
        file: 'dist/react.js',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      typescript({
        tsconfig: '../../tsconfig.json',
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
  },
];
