import { expression as n, registerExtension } from 'nornj';
import { observable } from 'mobx';
import schema from 'async-validator';
import extensionConfigs from '../../../mobx/formData/extensionConfig';

const createFormData = () => ({
  _njMobxFormData: true,

  fieldDatas: new Map(),

  _validate(name) {
    const oFd = this.fieldDatas.get(name);
    let value = this[name];
    switch (oFd.type) {
      case 'number':
      case 'integer':
      case 'float':
        value = n`${value}.trim()` !== '' ? +value : '';
        break;
      case 'boolean':
        value = n`${value}.trim()` !== '' ? Boolean(value) : '';
        break;
    }

    return new Promise((resolve, reject) => {
      oFd.validator.validate({ [name]: value }, (errors, fields) => {
        if (errors) {
          this.error(n`${errors}[0].message`, name);
          reject({ errors, fields });
        } else {
          this.clear(name);
          resolve();
        }
      });
    });
  },

  validate(name) {
    if (name != null) {
      return this._validate(name);
    } else {
      const validators = [];
      this.fieldDatas.forEach((fieldData, name: string) => {
        validators.push(this._validate(name));
      });

      return Promise.all(validators);
    }
  },

  error(help, name) {
    const oFd = this.fieldDatas.get(name);
    oFd.validateStatus = 'error';
    oFd.help = help;
  },

  _clear(name) {
    const oFd = this.fieldDatas.get(name);
    oFd.validateStatus = null;
    oFd.help = null;
  },

  clear(name) {
    if (name != null) {
      return this._clear(name);
    } else {
      this.fieldDatas.forEach((fieldData, name: string) => {
        this._clear(name);
      });
    }
  },

  _reset(name) {
    this.clear(name);
    const oFd = this.fieldDatas.get(name);
    oFd.reset();
  },

  reset(name) {
    if (name != null) {
      return this._reset(name);
    } else {
      this.fieldDatas.forEach((fieldData, name: string) => {
        this._reset(name);
      });
    }
  },

  add(fieldData) {
    const { name, value, type = 'string', required = false, trigger = 'onChange', ...ruleOptions } = fieldData;
    const fd = { name, value, type, required, trigger, ...ruleOptions };

    fd.validator = new schema({
      [name]: {
        type,
        required,
        ...ruleOptions
      }
    });

    fd.reset = function() {
      this.value = value;
    };

    const oFd = observable(fd);
    this.fieldDatas.set(name, oFd);

    Object.defineProperty(this, name, {
      get: function() {
        return this.fieldDatas.get(name).value;
      },
      set: function(value) {
        this.setValue(name, value);
      },
      enumerable: true,
      configurable: true
    });
  },

  delete(name) {
    this.fieldDatas.delete(name);
  },

  setValue(name, value) {
    this.fieldDatas.get(name).value = value;
  }
});

registerExtension(
  'mobxFormData',
  options => {
    const { children, props } = options;
    let _children = children();
    if (!Array.isArray(_children)) {
      _children = [_children];
    }

    const formData = createFormData();
    _children.forEach(fieldData => {
      fieldData && formData.add(fieldData);
    });

    return n`${props}.observable` ? observable(formData) : formData;
  },
  extensionConfigs.mobxFormData
);

registerExtension('mobxFieldData', options => options.props, extensionConfigs.mobxFieldData);

registerExtension(
  'mobxField',
  options => {
    const { value, tagProps } = options;
    const _value = value();
    const { prop, source } = _value;
    const oFd = source.fieldDatas.get(prop);

    tagProps.validateStatus = oFd.validateStatus;
    tagProps.help = oFd.help;
  },
  extensionConfigs.mobxField
);
