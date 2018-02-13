import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import license  from 'rollup-plugin-license';

const env = process.env.NODE_ENV;
const config = {
  input: './src/base.js',
  output: { name: 'NornJ' },
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          "env",
          {
            modules: false
          }
        ]
      ],
      plugins: ['external-helpers'],
    })
  ]
};

if (env === 'cjs') {
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
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

config.plugins.push(license({
  banner: `/*!
* NornJ template engine v${require("./package.json").version}
* (c) 2016-2018 Joe_Sky
* Released under the MIT License.
*/`
}), filesize());

export default config;