import nj, { registerExtension } from 'nornj';
import { observable, runInAction, reaction, extendObservable, isComputedProp } from 'mobx';
import schema, { RuleItem } from 'async-validator';
import extensionConfigs from '../../../mobx/formData/extensionConfig';
import { MobxFormDataProps, MobxFormDataInstance, MobxFieldDataProps, MobxFieldDataInstance } from '../../interface';
import moment from 'moment';

type operateCallback = (name: string) => void;

type operateCallbackMulti = (name: string[]) => void;

const createFormData = (
  options?: MobxFormDataProps
): MobxFormDataInstance & {
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

      if (callbackMultiReturn) {
        return callbackMultiReturn(names);
      }
    }
  },

  _validate(name) {
    const oFd = this.fieldDatas.get(name);
    const value = this[name];

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
    const { name, value, trigger = 'valueChange', rules, ...ruleOptions } = fieldData;
    const fd: MobxFieldDataInstance = { name, value, trigger, rules, ...ruleOptions };
    const _rules = rules ? rules : [ruleOptions];
    fd.rules = _rules;

    fd.setDefaultRule = rule => {
      const schemaRules: RuleItem[] = (fd.validatorSchema as any).rules[name];
      _rules.forEach((r, i) => {
        if (r.type == null) {
          schemaRules[i].type = rule.type;
        }
      });
    };

    fd.validatorSchema = new schema({
      [name]: _rules.map(({ type = 'string', required = false, transform: _transform, ...others }) => ({
        type,
        required,
        transform(_value) {
          switch (this.type) {
            case 'number':
            case 'integer':
            case 'float':
              _value = nj.isString(_value) && _value?.trim() !== '' && !isNaN(_value) ? +_value : _value;
              break;
            case 'date':
              if (moment.isMoment(_value)) {
                _value = _value.toDate();
              }
              break;
          }

          return _transform ? _transform(_value) : _value;
        },
        ...others
      }))
    });

    fd.reset = function() {
      this._resetting = true;
      this.value = value;
    };

    const oFd = observable(fd);
    this.fieldDatas.set(name, oFd);

    if (options?.validateMessages) {
      const { validateMessages } = options;
      (fd.validatorSchema as any).messages(
        typeof validateMessages === 'function' ? validateMessages(oFd) : validateMessages
      );
    }

    !isComputedProp(this, name) &&
      extendObservable(
        this,
        Object.defineProperty({}, name, {
          get: function() {
            return this.fieldDatas.get(name)?.value;
          },
          set: function(value) {
            this.setValue(name, value);
          },
          enumerable: true,
          configurable: true
        })
      );

    if (trigger === 'valueChange') {
      oFd._reactionDispose = reaction(
        () => this[name],
        () => {
          if (!oFd._resetting) {
            this.validate(name).catch(nj.noop);
          }
          oFd._resetting = false;
        }
      );
    }
  },

  delete(name) {
    const oFd = this.fieldDatas.get(name);
    oFd?._reactionDispose();
    this.fieldDatas.delete(name);
  },

  setValue(name, value) {
    runInAction(() => {
      if (typeof name === 'string') {
        const fieldData = this.fieldDatas.get(name);
        if (fieldData) {
          fieldData.value = value;
        }
      } else {
        this.fieldDatas.forEach((fieldData, fieldName: string) => {
          if (fieldName in name) {
            fieldData.value = name[fieldName];
          }
        });
      }
    });
  },

  get formData() {
    return this;
  }
});

registerExtension(
  'mobxFormData',
  options => {
    const { children } = options;
    const props: MobxFormDataProps = options.props;
    let _children = children();
    if (!Array.isArray(_children)) {
      _children = [_children];
    }

    const formData = createFormData(props);
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
    tagProps.required = oFd.rules.find(rule => rule.required);
    if (!tagProps.label && oFd.label) {
      tagProps.label = oFd.label;
    }
  },
  extensionConfigs.mobxField
);
