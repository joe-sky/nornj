import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { observer } from 'mobx-react';
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
    <MobxFormData>
      <MobxFieldData name="userName" required message="Please input your username!" />
      <MobxFieldData name="password" required message="Please input your password!" />
      <MobxFieldData name="remember" type="boolean" />
    </MobxFormData>
  ));

  return (
    <Form {...layout} n-style="max-width:600">
      <Form.Item n-mobxField={formData.userName} label="Username">
        <Input />
      </Form.Item>

      <Form.Item n-mobxField={formData.password} label="Password">
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} n-mobxField={formData.remember}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          onClick={e =>
            formData
              .validate()
              .then(values => {
                console.log(values);
              })
              .catch(errorInfo => {
                console.log(errorInfo);
              })
          }>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
