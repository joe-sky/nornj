module.exports = {
  rootDir: '../',
  collectCoverageFrom: [
    'packages/nornj/src/**/*.{js,jsx,ts,tsx}',
    '!packages/nornj/src/**/*.runtime.{js,jsx,ts,tsx}',
    'packages/nornj-react/src/**/*.{js,jsx,ts,tsx}',
    'packages/nornj-react/antd/**/*.{js,jsx,ts,tsx}',
    '!packages/nornj-react/antd/**/style/*.*',
    '!packages/nornj-react/antd/lib/**/*.*',
    '!packages/nornj-react/antd/**/*.d.ts'
  ],
  setupFiles: ['<rootDir>/test/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/node_modules/jest-enzyme/lib/index.js'],
  testMatch: [
    '<rootDir>/packages/nornj/**/__tests__/**/*.(spec|test).{js,jsx,ts,tsx}',
    '<rootDir>/packages/nornj-react/**/__tests__/**/*.(spec|test).{js,jsx,ts,tsx}'
  ],
  testEnvironment: 'enzyme',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['<rootDir>/node_modules/babel-jest', { configFile: './test/jest.babelrc' }],
    '^.+\\.m\\.(less|scss)$': '<rootDir>/node_modules/jest-css-modules-transform',
    '^.+\\.(css|less|scss)$': '<rootDir>/test/transforms/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|less|scss|json)$)': '<rootDir>/test/transforms/fileTransform.js'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/).+(js|jsx|ts|tsx|mjs)$'],
  coverageDirectory: '<rootDir>/test/coverage',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    nornj: 'nornj/dist/nornj.esm.js'
  }
};
