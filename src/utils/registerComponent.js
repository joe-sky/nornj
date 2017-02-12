import nj from '../core';
import * as tools from './tools';

//注册组件
export default function registerComponent(name, component) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = component;
  }

  tools.each(params, function (v, k) {
    nj.components[k.toLowerCase()] = v;
  }, false, false);

  return component;
}