import React, { Component, useState, useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import nj, { expression as n } from 'nornj';
import '../../../src/base';
import '../../../src/extension/mobx/base';
import { useFormData } from '../../../src/extension/mobx/mobxFormData';
import { observer } from 'mobx-react-lite';
import Form from '../../../antd/form';
import Input from '../../../antd/input';
import Checkbox from '../../../antd/checkbox';

const TestForm = React.forwardRef((props, ref) => {
  const formData = useFormData(() => (
    <mobxFormData>
      <>
        <mobxFieldData
          name="userName"
          value="joe_sky"
          rules={[
            { required: true, message: '不能为空' },
            { min: 3, message: '至少输入3个字符' }
          ]}
          trigger="onChange"
        />
        <mobxFieldData name="age" value="18" type="number" />
        <if condition={ref != null}>
          <mobxFieldData name="worked" value={true} type="boolean" required />
        </if>
      </>
      <each of={[1, 2, 3]}>
        <mobxFieldData name={`field${item}`} value={item} type="number" />
      </each>
    </mobxFormData>
  ));

  useEffect(() => {
    ref.current = formData;
  }, []);

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
});

describe('Rules', function() {
  const ref = React.createRef();
  const app = mount(<TestForm ref={ref} />);
  const formData = ref.current;

  it('String value', async () => {
    expect(
      app
        .find('input')
        .at(0)
        .props().value
    ).toEqual('joe_sky');

    await act(async () => {
      app
        .find('input')
        .at(0)
        .simulate('change', { target: { value: '' } });
    });
    app.update();

    expect(app.find('.field1.ant-form-item-has-error').length).toBeGreaterThan(0);

    app
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'joe' } });
    app.update();

    expect(app.find('.field1.ant-form-item-has-error').length).toEqual(0);
  });

  it('Number value', async () => {
    expect(
      app
        .find('input')
        .at(1)
        .props().value
    ).toEqual('18');

    await act(async () => {
      app
        .find('input')
        .at(1)
        .simulate('change', { target: { value: 'joe_sky' } });
    });
    app.update();

    expect(app.find('.field2.ant-form-item-has-error').length).toBeGreaterThan(0);

    app
      .find('input')
      .at(1)
      .simulate('change', { target: { value: '28' } });
    app.update();

    expect(app.find('.field2.ant-form-item-has-error').length).toEqual(0);
  });

  it('Boolean value', async () => {
    expect(
      app
        .find('input')
        .at(2)
        .props().checked
    ).toEqual(true);

    await act(async () => {
      formData.worked = false;
    });
    app.update();

    expect(
      app
        .find('input')
        .at(2)
        .props().checked
    ).toEqual(false);

    await act(async () => {
      formData.worked = 'true';
    });
    app.update();

    expect(app.find('.field3.ant-form-item-has-error').length).toBeGreaterThan(0);

    await act(async () => {
      formData.worked = true;
    });
    app.update();

    expect(app.find('.field3.ant-form-item-has-error').length).toEqual(0);
  });
});
