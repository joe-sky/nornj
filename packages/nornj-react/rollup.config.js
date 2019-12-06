import babel from 'rollup-plugin-babel';
import dts from 'rollup-plugin-dts';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';

const env = process.env.NODE_ENV;
const type = process.env.TYPE;
const withEx = process.env.WITH_EX || '';
let config;

if (type !== 'dts') {
  const libName = `NornJReact${withEx}`;
  let indexEntry = './src/base.ts';
  const external = ['nornj', 'react', 'react-dom'];
  switch (withEx) {
    case 'Mobx':
      external.push('mobx', 'mobx-react');
      indexEntry = './mobx/base.js';
      break;
    case 'Redux':
      external.push('react-redux');
      indexEntry = './redux/base.js';
      break;
    case 'Router':
      external.push('react-router-dom');
      indexEntry = './router/base.js';
      break;
  }
  config = {
    input: indexEntry,
    output: {
      name: libName,
      globals: {
        nornj: 'NornJ',
        react: 'React',
        'react-dom': 'ReactDOM',
        mobx: 'mobx',
        'mobx-react': 'mobxReact',
        'react-redux': 'ReactRedux',
        'react-router-dom': 'ReactRouterDOM'
      }
    },
    external,
    plugins: [
      babel({
        babelrc: false,
        presets: [
          ['@babel/preset-typescript', { allowNamespaces: true }],
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ],
          '@babel/preset-react'
        ],
        plugins: [
          [
            '@babel/plugin-proposal-class-properties',
            {
              loose: true
            }
          ]
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      resolve({
        customResolveOptions: {
          moduleDirectory: ['src', 'mobx', 'redux', 'router']
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      })
    ]
  };

  if (env === 'cjs' || env === 'es') {
    config.output.format = env;
  }

  if (env === 'development' || env === 'production') {
    config.output.format = 'umd';
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    );
  }

  if (env === 'production') {
    config.plugins.push(
      uglify({
        compress: {
          pure_getters: true, // eslint-disable-line
          unsafe: true,
          unsafe_comps: true // eslint-disable-line
        },
        warnings: false
      })
    );
  }

  config.plugins.push(filesize());
} else {
  config = {
    input: './src/base.ts',
    output: { format: 'es' },
    plugins: [dts()]
  };
}

config.plugins.push(
  license({
    banner: `/*!
 * NornJ-React${withEx ? '-' + withEx : ''} v${require('../../package.json').version}
 * (c) 2016-2019 Joe_Sky
 * Released under the MIT License.
 */`
  })
);

export default config;
