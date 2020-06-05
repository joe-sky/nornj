import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useLocalStore } from 'mobx-react-lite';
import { observer } from 'mobx-react';
import { reaction, autorun } from 'mobx';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const Demo = props => {
  const state = useLocalStore(() => ({
    rememberMe: false
  }));

  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" required message="Please input your username!" />
      <MobxFieldData name="password" message="Please input your password!" />
    </MobxFormData>
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

  const onRememberMeChange = () => {
    formData.fieldDatas.get('password').rules[0].required = state.rememberMe;
    formData.validate('password');
  };

  return (
    <Form {...layout} n-style="max-width:600">
      <Form.Item n-mobxField={formData.userName} label="Username">
        <Input />
      </Form.Item>

      <Form.Item n-mobxField={formData.password} label="Password">
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Checkbox n-mobxBind={state.rememberMe} onChange={onRememberMeChange}>
          Remember me
        </Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default observer(Demo);
