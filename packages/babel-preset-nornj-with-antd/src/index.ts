import merge from 'lodash.merge';

export default function(context, { moduleResolver, pluginImport, nornjInJsx }: Record<string, any> = {}) {
  const plugins = [
    [
      require.resolve('babel-plugin-module-resolver'),
      merge(
        {
          alias: {
            '^antd$': 'nornj-react/antd'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs']
        },
        moduleResolver
      )
    ],
    [
      require.resolve('babel-plugin-import'),
      merge(
        {
          libraryName: 'nornj-react/antd',
          style: false
        },
        pluginImport
      ),
      'nornj-react/antd'
    ],
    [
      require.resolve('babel-plugin-nornj-in-jsx'),
      merge(
        {
          imports: ['nornj-react/antd'],
          extensionConfig: {
            switch: {
              needPrefix: 'onlyUpperCase'
            },
            empty: {
              needPrefix: 'onlyUpperCase'
            }
          }
        },
        nornjInJsx
      )
    ]
  ];

  return {
    plugins
  };
}
