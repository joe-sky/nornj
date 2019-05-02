import nj from '../core';
import * as tools from './tools';
const { components, componentConfig } = nj;

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
    let comp;
    if (v != null) {
      const { component, options } = v;
      const name = k.toLowerCase();

      comp = component ? component : v;
      components[name] = comp;
      componentConfig.set(comp, options);
    }

    if (i == 0) {
      ret = comp;
    }
    else {
      if (i == 1) {
        ret = [ret];
      }
      ret.push(comp);
    }
  }, false);

  return ret;
}

export function getComponentConfig(name) {
  return componentConfig.get(tools.isString(name) ? components[name] || name : name);
}

export function copyComponentConfig(component, from) {
  componentConfig.set(component, componentConfig.get(from));
  return component;
}