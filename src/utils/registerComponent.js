import nj from '../core';
import * as tools from './tools';
const COMP_NAME = '_njComponentName';

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
      nj.componentConfig[name] = options;

      if (comp[COMP_NAME] == null) {
        tools.defineProp(comp, COMP_NAME, {
          value: name,
          writable: true
        });
      }
      else if (options && options.replaceComponentName) {
        comp[COMP_NAME] = name;
      }
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
  return nj.componentConfig[tools.isString(name) ? name : name._njComponentName];
}