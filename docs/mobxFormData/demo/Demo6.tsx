import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useLocalStore } from 'mobx-react-lite';
import { observer } from 'mobx-react';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const Demo = props => {
  const state = useLocalStore(() => ({
    checkNick: false
  }));

  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="name" required message="Please input your name" />
      <MobxFieldData name="nickname" message="Please input your nickname" />
    </MobxFormData>
  ));

  const onCheck = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
    formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  const onCheckNickChange = () => {
    formData.fieldDatas.get('nickname').rules[0].required = state.checkNick;
    formData.validate('nickname');
  };

  return (
    <Form {...layout} n-style="max-width:600">
      <Form.Item n-mobxField={formData.name} label="Name">
        <Input placeholder="Please input your name" />
      </Form.Item>

      <Form.Item n-mobxField={formData.nickname} label="Nickname">
        <Input placeholder="Please input your nickname" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Checkbox n-mobxBind={state.checkNick} onChange={onCheckNickChange}>
          Nickname is required
        </Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={onCheck}>
          Check
        </Button>
      </Form.Item>
    </Form>
  );
};

export default observer(Demo);