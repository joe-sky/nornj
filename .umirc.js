const deploy = process.env.DUMI_DEPLOY === 'true';

export default {
  base: '/nornj/',
  publicPath: '/nornj/',
  exportStatic: {},
  extraBabelPresets: [
    [
      'nornj-with-antd',
      {
        extensionConfig: {
          tooltip: {
            needPrefix: 'onlyUpperCase'
          }
        }
      }
    ]
  ],
  mode: 'site',
  title: 'NornJ',
  logo: `/${deploy ? 'nornj/' : ''}images/logo.png`,
  favicon: `/${deploy ? 'nornj/' : ''}favicon.ico`,
  dynamicImport: {},
  //manifest: {},
  //links: [{ rel: 'manifest', href: '/asset-manifest.json' }],
  hash: true,
  resolve: {
    includes: ['docs']
  },
  navs: {
    'zh-CN': [
      null,
      { title: 'GitHub', path: 'https://github.com/joe-sky/nornj' },
      { title: '更新日志', path: 'https://github.com/joe-sky/nornj/blob/master/packages/nornj/CHANGELOG.md' }
    ],
    'en-US': [
      null,
      { title: 'GitHub', path: 'https://github.com/joe-sky/nornj' },
      { title: 'Changelog', path: 'https://github.com/joe-sky/nornj/blob/master/packages/nornj/CHANGELOG.md' }
    ]
  },
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English']
  ]
};
