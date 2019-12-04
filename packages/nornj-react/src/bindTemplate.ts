import nj, { ElementType } from 'nornj';

function _registerComponent(name: string, component: ElementType) {
  if (name != null) {
    nj.registerComponent(name, component);
  }
}

export function bindTemplate<T extends ElementType>(target: T): T;
export function bindTemplate(name: string | ElementType): <T extends ElementType>(target: T) => T;
export function bindTemplate(name) {
  if (nj.isString(name)) {
    return function(component: ElementType) {
      _registerComponent(name, component);

      return component;
    };
  } else {
    name.name && _registerComponent(name.name, name);

    return name;
  }
}
