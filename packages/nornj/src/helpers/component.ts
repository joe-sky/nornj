import nj from '../core';
import * as tools from '../utils/tools';
import { Component, ComponentOption, ComponentOptionFunc } from '../interface';

type ComponentOptionOrFunc = ComponentOption | ComponentOptionFunc;

export const components: { [name: string]: Component } = {};

export const componentConfig: Map<Component, ComponentOptionOrFunc> = new Map();

export function registerComponent(options: {
  [name: string]: Component | { component?: Component; options?: ComponentOptionOrFunc };
}): Component | Component[];
export function registerComponent(
  name: string,
  component: Component,
  options?: ComponentOptionOrFunc
): Component | Component[];
export function registerComponent(name, component?: Component, options?: ComponentOptionOrFunc) {
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
        const { component, options }: { component: Component; options: ComponentOptionOrFunc } = v;
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

export function getComponentConfig(name: Component): ComponentOptionOrFunc {
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
