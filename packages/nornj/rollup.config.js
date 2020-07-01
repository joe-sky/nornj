import babel from 'rollup-plugin-babel';
import dts from 'rollup-plugin-dts';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';

const env = process.env.NODE_ENV;
const type = process.env.TYPE;
let config;

if (type !== 'dts') {
  config = {
    input: './src/base' + (type == 'runtime' ? '.runtime' : '') + '.ts',
    output: { name: 'NornJ' },
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
          ]
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      resolve({
        customResolveOptions: {
          moduleDirectory: 'src'
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

  if (env === 'cjs' || env === 'es') {
    config.plugins.push(
      copy({
        targets: [
          {
            src: 'types/dist.definition.ts',
            dest: 'dist',
            rename: `${env === 'cjs' ? 'nornj.common' : 'nornj.esm'}.d.ts`
          }
        ]
      })
    );
  }
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
 * NornJ template engine v${require('../../package.json').version}
 * (c) Joe_Sky
 * Released under the MIT License.
 */`
  })
);

export default config;
