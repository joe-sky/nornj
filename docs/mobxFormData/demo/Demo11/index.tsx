import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal, Button, Avatar, Typography } from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { useLocalStore } from 'mobx-react-lite';
import { MobxFormDataInstance } from 'nornj-react';
import './style.less';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

interface ModalFormProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCancel: () => void;
  formDataList: MobxFormDataInstance;
}

interface User {
  name: string;
  age: number;
}

const ModalForm: React.FC<ModalFormProps> = ({ visible, setVisible, onCancel, formDataList }) => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="name" required />
      <MobxFieldData name="age" required />
    </MobxFormData>
  ));

  const onOk = () =>
    formData
      .validate()
      .then(values => {
        formDataList.users.push({
          name: values.name,
          age: values.age
        } as User);
        setVisible(false);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  return (
    <Modal title="Basic Drawer" visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form layout="vertical">
        <Form.Item label="User Name" n-mobxField={formData.name}>
          <Input />
        </Form.Item>
        <Form.Item label="User Age" n-mobxField={formData.age}>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default props => {
  const [visible, setVisible] = useState(false);

  const showUserModal = () => {
    setVisible(true);
  };

  const hideUserModal = () => {
    setVisible(false);
  };

  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="group" required />
      <MobxFieldData name="users" value={[]} type="array" required />
    </MobxFormData>
  ));

  const onSubmit = () =>
    formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  let user: User;

  return (
    <div id="components-form-demo-form-context">
      <Form {...layout} n-style="max-width:600">
        <Form.Item label="Group Name" n-mobxField={formData.group}>
          <Input />
        </Form.Item>
        <Form.Item label="User List" n-mobxField-noBind={formData.users}>
          <each of={formData.users} item="user">
            <empty>
              <Typography.Text className="ant-form-text" type="secondary">
                ( <SmileOutlined /> No user yet. )
              </Typography.Text>
            </empty>
            <ul>
              <li key={index} className="user">
                <Avatar icon={<UserOutlined />} />
                {user.name} - {user.age}
              </li>
            </ul>
          </each>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" onClick={onSubmit}>
            Submit
          </Button>
          <Button style={{ margin: '0 8px' }} onClick={showUserModal}>
            Add User
          </Button>
        </Form.Item>
      </Form>

      <ModalForm visible={visible} setVisible={setVisible} onCancel={hideUserModal} formDataList={formData} />
    </div>
  );
};
