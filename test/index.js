// require all test files (files that ends with .spec.js)
// require 所有的测试文件 *.spec.js
const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
// require 需要统计覆盖率的源码文件
const srcContext = require.context('../src', true, /^\.\/[\s\S]*\.js$/);
srcContext.keys().forEach(srcContext);