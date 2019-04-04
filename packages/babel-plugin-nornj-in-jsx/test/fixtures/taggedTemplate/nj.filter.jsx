const React = require('react');
import nj, { expression as n } from 'nornj';
nj.registerFilter({
  cut: (v, len) => {
    len && len._njOpts && (len = 2);
    return v.substr(len);
  }
});

module.exports = props => {
  return (
    <i>{n`${props.value} | cut(2) | capitalize`}</i>
  );
};
