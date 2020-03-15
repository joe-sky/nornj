import React, { Component, useState } from 'react';
import { shallow, mount } from 'enzyme';
import nj, { expression as n } from 'nornj';
import '../../../src/base';
import '../../../src/extension/mobx/base';
import '../../../src/extension/mobx/mobxFormData';
import { useLocalStore } from 'mobx-react-lite';
import Form from '../../../antd/form';
import Input from '../../../antd/input';
import Checkbox from '../../../antd/checkbox';

function TestForm(props) {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" trigger="onChange" required />
      <MobxFieldData name="age" value="18" type="number" />
      <MobxFieldData name="worked" value={true} type="boolean" required />
    </MobxFormData>
  ));

  props.formDataRef.current = formData;

  return (
    <>
      <Form.Item n-mobxField={formData.userName} className="field1" label="User Name">
        <Input />
      </Form.Item>
      <Form.Item n-mobxField={formData.age} className="field2" label="Age">
        <Input />
      </Form.Item>
      <Form.Item n-mobxField={formData.worked} className="field3" label="Already Worked">
        <Checkbox value="worked" />
      </Form.Item>
    </>
  );
}

describe('Validate', function() {
  const ref = React.createRef();
  const app = mount(<TestForm formDataRef={ref} />);
  const formData = ref.current;

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

  it('Boolean value', () => {
    expect(
      app
        .find('input')
        .at(2)
        .props().checked
    ).toEqual(true);

    formData.worked = false;
    app.update();
    expect(
      app
        .find('input')
        .at(2)
        .props().checked
    ).toEqual(false);

    formData.worked = 'true';
    app.update();
    expect(
      app
        .find('.field3 .ant-form-item-control')
        .at(0)
        .hasClass('has-error')
    ).toEqual(true);

    formData.worked = true;
    app.update();
    expect(
      app
        .find('.field3 .ant-form-item-control')
        .at(0)
        .hasClass('has-error')
    ).toEqual(false);
  });
});
