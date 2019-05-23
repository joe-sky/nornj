import React from 'react';
import nj from 'nornj';

nj.registerExtension(
  'while',
  options => {
    const { props, children } = options;
    const ret = [];

    while (props.test()) {
      ret.push(children());
    }

    return ret;
  }
);

nj.registerExtension(
  'set',
  options => {
    options.children();
  }
);

module.exports = function (props) {
  let count = 0;

  return (
    <While test={() => count < 10}>
      <If condition={count >= 5}>
        <div>{count}</div>
      </If>
      <Set>{count++}</Set>
    </While>
  );
};