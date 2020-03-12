import React, { Component, useState } from 'react';
import { shallow, mount } from 'enzyme';
import nj, { expression as n } from 'nornj';
import '../../../src/base';
import '../../../src/extension/mobx/base';
import '../../../src/extension/mobx/mobxFormData';
import { useLocalStore } from 'mobx-react-lite';
import Form from '../../../antd/form';
import Input from '../../../antd/input';

function TestForm() {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" required />
      <MobxFieldData name="age" value="18" type="number" />
    </MobxFormData>
  ));

  return (
    <>
      <Form.Item className="field1" label="User Name" n-mobxField={formData.userName}>
        <Input />
      </Form.Item>
      <Form.Item className="field2" label="Age" n-mobxField={formData.age}>
        <Input />
      </Form.Item>
    </>
  );
}

describe('Validate', function() {
  const app = mount(<TestForm />);

  it('String value', () => {
    expect(
      app
        .find('input')
        .at(0)
        .props().value
    ).toEqual('joe_sky');

    app
      .find('input')
      .at(0)
      .simulate('change', { target: { value: '' } });
    app.update();
    expect(
      app
        .find('.field1 .ant-form-item-control')
        .at(0)
        .hasClass('has-error')
    ).toEqual(true);

    app
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'joe' } });
    app.update();
    expect(
      app
        .find('.field1 .ant-form-item-control')
        .at(0)
        .hasClass('has-error')
    ).toEqual(false);
  });

  it('Number value', () => {
    expect(
      app
        .find('input')
        .at(1)
        .props().value
    ).toEqual('18');

    app
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'joe_sky' } });
    app.update();
    expect(
      app
        .find('.field2 .ant-form-item-control')
        .at(0)
        .hasClass('has-error')
    ).toEqual(true);

    app
      .find('input')
      .at(1)
      .simulate('change', { target: { value: '28' } });
    app.update();
    expect(
      app
        .find('.field2 .ant-form-item-control')
        .at(0)
        .hasClass('has-error')
    ).toEqual(false);
  });
});
