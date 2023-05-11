import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/vanilla/index.ts',
    output: [
      {
        file: 'html/dist/vanilla.js',
        format: 'umd',
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
    input: 'src/react/index.tsx',
    output: [
      {
        file: 'html/dist/react.js',
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
