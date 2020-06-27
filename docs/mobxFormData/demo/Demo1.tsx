import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useLocalStore } from 'mobx-react-lite';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

export default props => {
  const { formData } = useLocalStore(() => (
    <mobxFormData>
      <mobxFieldData name="userName" required message="Please input your username!" />
      <mobxFieldData name="password" required message="Please input your password!" />
      <mobxFieldData name="remember" />
    </mobxFormData>
  ));

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
    formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  return (
    <Form {...layout} style={{ maxWidth: 600 }}>
      <Form.Item mobxField={formData.userName} label="Username">
        <Input />
      </Form.Item>

      <Form.Item mobxField={formData.password} label="Password">
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} mobxField={formData.remember}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
