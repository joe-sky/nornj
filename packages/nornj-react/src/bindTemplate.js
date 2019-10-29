import nj from 'nornj';

function _registerComponent(name, component) {
  if (name != null) {
    nj.registerComponent(name, component);
  }
}

export default function bindTemplate(name) {
  if (nj.isString(name)) {
    return function(component) {
      _registerComponent(name, component);

      return component;
    };
  } else {
    name.name && _registerComponent(name.name, name);

    return name;
  }
}
