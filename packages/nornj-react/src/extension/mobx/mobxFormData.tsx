import nj, { registerExtension } from 'nornj';
import { observable, runInAction, reaction } from 'mobx';
import schema from 'async-validator';
import extensionConfigs from '../../../mobx/formData/extensionConfig';
import { MobxFormDataInstance, MobxFieldDataProps, MobxFieldDataInstance } from '../../interface';

type operateCallback = (name: string) => void;

type operateCallbackMulti = (name: string[]) => void;

const createFormData = (): MobxFormDataInstance & {
  _operate(
    name: string | string[],
    callback: operateCallback,
    callbackMulti?: operateCallback,
    callbackMultiReturn?: operateCallbackMulti
  ): any;
  _validate(name: string): Promise<any>;
  _clear(name: string): any;
  _reset(name: string): any;
} => ({
  _njMobxFormData: true,

  fieldDatas: new Map(),

  _operate(name, callback, callbackMulti, callbackMultiReturn) {
    if (typeof name === 'string') {
      return callback(name);
    } else {
      const names = Array.isArray(name) ? name : [];
      this.fieldDatas.forEach((fieldData, name) => {
        (!names.length || names.indexOf(name) > -1) && (callbackMulti || callback)(name);
      });

      return callbackMultiReturn(names);
    }
  },

  _validate(name) {
    const oFd = this.fieldDatas.get(name);
    let value = this[name];
    switch (oFd.type) {
      case 'number':
      case 'integer':
      case 'float':
        value = nj.isString(value) && value?.trim() !== '' && !isNaN(value) ? +value : value;
        break;
    }

    return new Promise((resolve, reject) => {
      oFd.validatorSchema.validate({ [name]: value }, {}, (errors, fields) => {
        if (errors) {
          this.error(name, errors?.[0]?.message);
          reject({ values: { [name]: value }, errors, fields });
        } else {
          this.clear(name);
          resolve({ [name]: value });
        }
      });
    });
  },

  validate(names) {
    const validators = [];

    return this._operate(
      names,
      name => this._validate(name),
      name => validators.push(this._validate(name)),
      () =>
        new Promise((resolve, reject) => {
          Promise.all(validators)
            .then(values => resolve(Object.assign({}, ...values)))
            .catch(errorInfo => reject(errorInfo));
        })
    );
  },

  error(name, help) {
    const oFd = this.fieldDatas.get(name);
    oFd.validateStatus = 'error';
    oFd.help = help;
  },

  _clear(name) {
    const oFd = this.fieldDatas.get(name);
    oFd.validateStatus = null;
    oFd.help = null;
  },

  clear(names) {
    return this._operate(names, name => this._clear(name));
  },

  _reset(name) {
    this.clear(name);
    const oFd = this.fieldDatas.get(name);
    oFd.reset();
  },

  reset(names) {
    return this._operate(names, name => this._reset(name));
  },

  add(fieldData: MobxFieldDataProps) {
    const { name, value, type = 'string', required = false, trigger = 'valueChange', ...ruleOptions } = fieldData;
    const fd: MobxFieldDataInstance = { name, value, type, required, trigger, ...ruleOptions };

    fd.validatorSchema = new schema({
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

    trigger === 'valueChange' &&
      reaction(
        () => this[name],
        () => this.validate(name).catch(nj.noop)
      );
  },

  delete(name) {
    this.fieldDatas.delete(name);
  },

  setValue(name, value) {
    if (typeof name === 'string') {
      runInAction(() => (this.fieldDatas.get(name).value = value));
    } else {
      this.fieldDatas.forEach((fieldData, fieldName: string) => {
        if (fieldName in name) {
          runInAction(() => (fieldData.value = name[fieldName]));
        }
      });
    }
  },

  get formData() {
    return this;
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
    _children.forEach((fieldData: MobxFieldDataInstance) => {
      fieldData && formData.add(fieldData);
    });

    return props?.observable ? observable(formData) : formData;
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
    const oFd: MobxFieldDataInstance = source.fieldDatas.get(prop);

    tagProps.validateStatus = oFd.validateStatus;
    tagProps.help = oFd.help;
    tagProps.required = oFd.required;
  },
  extensionConfigs.mobxField
);
