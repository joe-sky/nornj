const React = require('react');
import nj, { expression as n } from 'nornj';
nj.registerFilter({
  cut: (v, len = 2) => {
    return v.substr(len);
  }
});

module.exports = props => {
  const count = 2;

  return <i>{n`props.value | cut(count) | upperFirst`}</i>;
};
