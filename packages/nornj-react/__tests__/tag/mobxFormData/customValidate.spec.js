import React, { Component, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import nj, { expression as n } from 'nornj';
import '../../../src/base';
import '../../../src/extension/mobx/base';
import { useFormData } from '../../../src/extension/mobx/mobxFormData';
import { observer } from 'mobx-react-lite';
import Form from '../../../antd/form';
import Input from '../../../antd/input';
import { sleep } from '../../../../../test/utils';

function TestForm() {
  const formData = useFormData(() => (
    <mobxFormData>
      <mobxFieldData
        name="userName"
        value="joe_sky"
        type="string"
        required
        validator={(rule, value, callback) => {
          setTimeout(() => {
            if (value == 'joe') {
              callback(new Error('用户名已存在'));
            } else {
              callback();
            }
          }, 100);
        }}
      />
    </mobxFormData>
  ));

  return (
    <Form.Item n-mobxField={formData.userName}>
      <Input />
    </Form.Item>
  );
}

function TestFormSync() {
  const formData = useFormData(() => (
    <mobxFormData>
      <mobxFieldData
        name="userName"
        value="joe_sky"
        type="string"
        required
        validator={(rule, value) => {
          if (value == 'joe') {
            return new Error('用户名已存在');
          }
          return true;
        }}
      />
    </mobxFormData>
  ));

  return (
    <Form.Item n-mobxField={formData.userName}>
      <Input />
    </Form.Item>
  );
}

describe('mobxFormData tag', function() {
  it('should render', () => {
    const app = mount(<TestForm />);
    expect(app.find('input').props().value).toEqual('joe_sky');
  });

  it('asynchronous custom verification succeeded', async () => {
    const app = mount(<TestForm />);
    const event = { target: { value: 'joe-sky' } };
    await act(async () => {
      app.find('input').simulate('change', event);

      await sleep(200);
      app.update();
      expect(app.find('div.ant-form-item-explain').length).toEqual(0);
    });
  });

  it('asynchronous custom verification failed', async () => {
    const app = mount(<TestForm />);
    const event = { target: { value: 'joe' } };
    await act(async () => {
      app.find('input').simulate('change', event);

      await sleep(200);
      app.update();
      expect(app.find('div.ant-form-item-explain').text()).toEqual('用户名已存在');
    });
  });

  it('custom verification succeeded', async () => {
    const app = mount(<TestFormSync />);
    const event = { target: { value: 'joe-sky' } };
    await act(async () => {
      app.find('input').simulate('change', event);
    });

    app.update();
    expect(app.find('div.ant-form-item-explain').length).toEqual(0);
  });

  it('custom verification failed', async () => {
    const app = mount(<TestFormSync />);
    const event = { target: { value: 'joe' } };
    await act(async () => {
      app.find('input').simulate('change', event);
    });

    app.update();
    expect(app.find('div.ant-form-item-explain').text()).toEqual('用户名已存在');
  });
});
