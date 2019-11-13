import nj from '../core';
import * as tools from '../utils/tools';
import { Component, ComponentOption } from '../interface';

export const components: { [name: string]: Component } = {};

export const componentConfig: Map<Component, ComponentOption> = new Map();

export function registerComponent(options: {
  [name: string]: Component | { component?: Component; options?: ComponentOption };
}): Component | Component[];
export function registerComponent(
  name: string,
  component: Component,
  options?: ComponentOption
): Component | Component[];
export function registerComponent(name, component?: Component, options?: ComponentOption) {
  let params = name,
    ret;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      component,
      options
    };
  }

  tools.each(
    params,
    (v, k, i) => {
      let comp;
      if (v != null) {
        const { component, options }: { component: Component; options: ComponentOption } = v;
        const name = k.toLowerCase();

        comp = component ? component : v;
        components[name] = comp;
        componentConfig.set(comp, options);
      }

      if (i == 0) {
        ret = comp;
      } else {
        if (i == 1) {
          ret = [ret];
        }
        ret.push(comp);
      }
    },
    false
  );

  return ret;
}

export function getComponentConfig(name: Component): ComponentOption {
  return componentConfig.get(tools.isString(name) ? components[name as string] || name : name);
}

export function copyComponentConfig(component: Component, from: Component): Component {
  componentConfig.set(component, componentConfig.get(from));
  return component;
}

tools.assign(nj, {
  components,
  componentConfig,
  registerComponent,
  getComponentConfig,
  copyComponentConfig
});
