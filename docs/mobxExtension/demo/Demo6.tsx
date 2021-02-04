import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useLocalStore } from 'mobx-react-lite';
import { observer } from 'mobx-react';
import { useFormData } from 'nornj-react/mobx/formData';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const Demo: React.FC = props => {
  const state = useLocalStore(() => ({
    checkNick: false
  }));

  const formData = useFormData(() => (
    <mobxFormData>
      <mobxFieldData name="name" required message="Please input your name" />
      <mobxFieldData name="nickname" message="Please input your nickname" />
    </mobxFormData>
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
    <Form {...layout} style={{ maxWidth: 600 }}>
      <Form.Item mobxField={formData.name} label="Name">
        <Input placeholder="Please input your name" />
      </Form.Item>

      <Form.Item mobxField={formData.nickname} label="Nickname">
        <Input placeholder="Please input your nickname" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Checkbox mobxBind={state.checkNick} onChange={onCheckNickChange}>
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
