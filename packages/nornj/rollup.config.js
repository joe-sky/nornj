import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';

const env = process.env.NODE_ENV;
const type = process.env.TYPE;
const config = {
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

config.plugins.push(
  license({
    banner: `/*!
* NornJ template engine v${require('../../lerna.json').version}
* (c) 2016-2019 Joe_Sky
* Released under the MIT License.
*/`
  }),
  filesize()
);

export default config;
