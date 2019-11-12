import nj from 'nornj';

function _registerComponent(name: string, component: React.ElementType) {
  if (name != null) {
    nj.registerComponent(name, component);
  }
}

export function bindTemplate<T extends React.ElementType>(target: T): T;
export function bindTemplate(name: string | React.ElementType): <T extends React.ElementType>(target: T) => T;
export function bindTemplate(name) {
  if (nj.isString(name)) {
    return function(component: React.ElementType) {
      _registerComponent(name, component);

      return component;
    };
  } else {
    name.name && _registerComponent(name.name, name);

    return name;
  }
}
