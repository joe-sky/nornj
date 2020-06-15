import React, { Component, useState, useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import nj, { expression as n } from 'nornj';
import '../../../src/base';
import '../../../src/extension/mobx/base';
import '../../../src/extension/mobx/mobxFormData';
import { useLocalStore } from 'mobx-react-lite';
import Form from '../../../antd/form';
import Input from '../../../antd/input';
import Checkbox from '../../../antd/checkbox';

const TestForm = React.forwardRef((props, ref) => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" trigger="onChange" required />
      <MobxFieldData name="age" value="18a" type="number" />
      <MobxFieldData name="worked" value={true} type="boolean" required />
    </MobxFormData>
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

describe('Validate', function() {
  const ref = React.createRef();
  const app = mount(<TestForm ref={ref} />);
  const formData = ref.current;

  it('Validate single field', async () => {
    try {
      let values;
      await act(async () => {
        values = await formData.validate('userName');
      });

      expect(values).toEqual({ userName: 'joe_sky' });
    } catch (errorInfo) {
      console.log(errorInfo);
    }

    try {
      let values;
      await act(async () => {
        values = await formData.validate('age');
      });

      console.log(values);
    } catch (errorInfo) {
      expect(errorInfo.errors[0].field).toEqual('age');
    }
  });

  it('Validate multiple fields', async () => {
    try {
      let values;
      await act(async () => {
        values = await formData.validate(['userName', 'worked']);
      });

      expect(values).toEqual({ userName: 'joe_sky', worked: true });
    } catch (errorInfo) {
      console.log(errorInfo);
    }

    try {
      let values;
      await act(async () => {
        values = await formData.validate(['userName', 'age']);
      });

      console.log(values);
    } catch (errorInfo) {
      expect(errorInfo.errors[0].field).toEqual('age');
    }
  });

  it('Validate all fields', async () => {
    await act(async () => {
      formData.age = 28;
    });

    try {
      let values;
      await act(async () => {
        values = await formData.validate();
      });

      expect(values).toEqual({ userName: 'joe_sky', age: 28, worked: true });
    } catch (errorInfo) {
      console.log(errorInfo);
    }

    await act(async () => {
      formData.age = '28a';
    });

    try {
      let values;
      await act(async () => {
        values = await formData.validate();
      });

      console.log(values);
    } catch (errorInfo) {
      expect(errorInfo.errors[0].field).toEqual('age');
    }
  });
});
