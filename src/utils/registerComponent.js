import nj from '../core';
import * as tools from './tools';

export default function registerComponent(name, component, options) {
  let params = name, ret;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      component,
      options
    };
  }

  tools.each(params, (v, k, i) => {
    if (v != null) {
      const { component, options } = v;
      const name = k.toLowerCase();

      const comp = component ? component : v;
      nj.components[name] = comp;
      nj.componentConfig.set(comp, options);
    }

    if (i == 0) {
      ret = v;
    }
    else {
      if (i == 1) {
        ret = [ret];
      }
      ret.push(v);
    }
  }, false, false);

  return ret;
}

export function getComponentConfig(name) {
  return nj.componentConfig.get(tools.isString(name) ? nj.components[name] : name);
}