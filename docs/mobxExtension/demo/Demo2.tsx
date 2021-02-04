import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { useFormData } from 'nornj-react/mobx/formData';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

export default observer(props => {
  const formData = useFormData(() => (
    <mobxFormData>
      <mobxFieldData
        name="note"
        rules={[
          { required: true, message: 'note is required' },
          { max: 20, message: 'cannot enter more than 20 characters' }
        ]}
      />
      <mobxFieldData name="gender" required />
      <mobxFieldData name="customizeGender" required />
    </mobxFormData>
  ));

  const onGenderChange = value => {
    switch (value) {
      case 'male':
        formData.note = 'Hi, man!';
        return;
      case 'female':
        formData.note = 'Hi, lady!';
        return;
      case 'other':
        formData.note = 'Hi there!';
        return;
    }
  };

  const onSubmit = () =>
    formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  const onReset = () => {
    formData.reset();
  };

  const onFill = () => {
    formData.note = 'Hello world!';
    formData.gender = 'male';
  };

  return (
    <Form {...layout} style={{ maxWidth: 600 }}>
      <Form.Item mobxField={formData.note} label="Note">
        <Input />
      </Form.Item>

      <Form.Item mobxField={formData.gender} label="Gender">
        <Select placeholder="Select a option and change input text above" onChange={onGenderChange} allowClear>
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>

      <if condition={formData.gender === 'other'}>
        <Form.Item mobxField={formData.customizeGender} label="Customize Gender">
          <Input />
        </Form.Item>
      </if>

      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={onSubmit} style={{ marginRight: 8 }}>
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  );
});
