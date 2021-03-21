import typescript from 'rollup-plugin-typescript2'
import nodeResolve from '@rollup/plugin-node-resolve'
import localResolve from 'rollup-plugin-local-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const external = id => /^react|react-dom/.test(id)
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
}

const plugins = [
  typescript({
    typescript: require('typescript'),
    clean: true,
  }),
  localResolve(),
  nodeResolve({
    browser: true,
    extensions,
  }),
  commonjs(),
]

export default {
  input: './index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      globals,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      globals,
    },
    {
      file: pkg.browser,
      format: 'umd',
      exports: 'named',
      name: 'views',
      plugins: [terser()],
      globals,
    },
  ],
  plugins,
  external,
}
