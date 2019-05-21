import React from 'react';
import nj from 'nornj';

nj.registerExtension(
  'simpleFor',
  options => {
    const { props, children } = options;

    return props.of.map((item, index) => children({
      data: [{
        item: item,
        index: index,
        firstItem: index == 0
      }]
    }));
  }
);

module.exports = function (props) {
  return (
    <div>
      <SimpleFor of={props.of} first="loopFirst">
        <If condition={!loopFirst}>
          <div key={index}>{item}</div>
        </If>
      </SimpleFor>
    </div>
  );
};