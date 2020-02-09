import React, { Component, useState } from 'react';
import { shallow, mount } from 'enzyme';
import nj, { expression as n } from 'nornj';
import '../../src/base';
import '../../mobx';
import { observable } from 'mobx';
import { useLocalStore } from 'mobx-react-lite';
import schema from 'async-validator';
import Form from '../../antd/form';
import Input from '../../antd/input';

nj.registerExtension(
  'mobxFormData',
  options => {
    const { children, props } = options;
    let _children = children();
    if (!Array.isArray(_children)) {
      _children = [_children];
    }

    const ret = {
      _njMobxFormData: true,
      fieldDatas: new Map(),
      validate(name) {
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
              this.error(oFd.message != null ? oFd.message : errors[0].message, name);
              reject({ errors, fields });
            } else {
              this.clear(name);
              resolve();
            }
          });
        });
      },
      error(help, name) {
        const oFd = this.fieldDatas.get(name);
        oFd.validateStatus = 'error';
        oFd.help = help;
      },
      clear(name) {
        const oFd = this.fieldDatas.get(name);
        oFd.validateStatus = null;
        oFd.help = null;
      },
      reset(name) {
        this.clear(name);
        const oFd = this.fieldDatas.get(name);
        oFd.reset();
      },
      add(fieldData) {
        const {
          name,
          value,
          type = 'string',
          required = false,
          message,
          trigger = 'onChange',
          ...ruleOptions
        } = fieldData;
        const fd = { name, value, type, required, message, trigger, ...ruleOptions };

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
          set: function(v) {
            this.fieldDatas.get(name).value = v;
          },
          enumerable: true,
          configurable: true
        });
      },
      delete(name) {
        this.fieldDatas.delete(name);
      }
    };

    _children.forEach(fieldData => {
      fieldData && ret.add(fieldData);
    });

    return props && props.observable ? observable(ret) : ret;
  },
  { onlyGlobal: true }
);

nj.registerExtension('mobxFieldData', options => options.props, { onlyGlobal: true });

nj.registerExtension(
  'mobxField',
  options => {
    const { value, tagProps } = options;
    const _value = value();
    const { prop, source } = _value;
    const oFd = source.fieldDatas.get(prop);

    tagProps.validateStatus = oFd.validateStatus;
    tagProps.help = oFd.help;
  },
  { onlyGlobal: true }
);

function TestForm() {
  const formData = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData
        name="userName"
        value="joe_sky"
        type="string"
        required
        asyncValidator={(rule, value, callback) => {
          setTimeout(() => {
            if (value == 'joe') {
              callback(new Error('用户名已存在'));
            } else {
              callback();
            }
          }, 100);
        }}
      />
    </MobxFormData>
  ));

  return (
    <MobxObserver>
      <Form.Item n-mobxField={formData.userName}>
        <Input n-mobxBind={formData.userName} />
      </Form.Item>
    </MobxObserver>
  );
}

describe('mobxFormData tag', function() {
  it('should render', () => {
    const app = mount(<TestForm />);
    expect(app.find('input').props().value).toEqual('joe_sky');
  });

  it('asynchronous verification succeeded', cb => {
    const app = mount(<TestForm />);
    const event = { target: { value: 'joe-sky' } };
    app.find('input').simulate('change', event);

    setTimeout(() => {
      app.update();
      expect(app.find('div.ant-form-explain').length).toEqual(0);
      cb();
    }, 200);
  });

  it('asynchronous verification failed', cb => {
    const app = mount(<TestForm />);
    const event = { target: { value: 'joe' } };
    app.find('input').simulate('change', event);

    setTimeout(() => {
      app.update();
      expect(app.find('div.ant-form-explain').text()).toEqual('用户名已存在');
      cb();
    }, 200);
  });
});
