import nj from '../core';
import * as tools from './tools';

//注册组件
export default function registerComponent(name, component) {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = component;
  }

  tools.each(params, (v, k) => {
    nj.components[k.toLowerCase()] = v;
  }, false, false);

  return component;
}