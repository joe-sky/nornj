import merge from 'lodash.merge';

export default function(context, { moduleResolverPlugin, importPlugin, ...nornjInJsx }: Record<string, any> = {}) {
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
        moduleResolverPlugin
      )
    ],
    [
      require.resolve('babel-plugin-import'),
      merge(
        {
          libraryName: 'nornj-react/antd',
          style: true
        },
        importPlugin
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
