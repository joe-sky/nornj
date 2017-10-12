import nj from '../core';
import * as tools from './tools';

//注册组件
export default function registerComponent(name, component) {
  let params = name, ret;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = component;
  }

  tools.each(params, (v, k, i) => {
    nj.components[k.toLowerCase()] = v;
    if(i == 0) {
      ret = v;
    }
  }, false, false);

  return ret;
}