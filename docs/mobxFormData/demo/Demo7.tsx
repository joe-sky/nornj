import React from 'react';
import { Form, Input, Select, Tooltip, Button } from 'antd';
import { useLocalStore } from 'mobx-react-lite';

const { Option } = Select;

export default props => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="username" required message="Username is required" />
      <MobxFieldData name="province" required message="Province is required" />
      <MobxFieldData name="street" required message="Street is required" />
      <MobxFieldData name="year" required />
      <MobxFieldData name="month" required />
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

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} n-style="max-width:600">
      <Form.Item n-mobxField={formData.username} label="Username">
        <Input style={{ width: 160 }} placeholder="Please input" />
        <Tooltip title="Useful information">
          <a href="#API" style={{ margin: '0 8px' }}>
            Need Help?
          </a>
        </Tooltip>
      </Form.Item>

      <Form.Item label="Address" n-mobxField={`formData[['province', 'street']]`}>
        <Input.Group compact>
          <Select placeholder="Select province" n-mobxBind={formData.province}>
            <Option value="Zhejiang">Zhejiang</Option>
            <Option value="Jiangsu">Jiangsu</Option>
          </Select>
          <Input style={{ width: '50%' }} placeholder="Input street" n-mobxBind={formData.street} />
        </Input.Group>
      </Form.Item>

      <Form.Item label="BirthDate" style={{ marginBottom: 0 }} required>
        <Form.Item n-mobxField={formData.year} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
          <Input placeholder="Input birth year" />
        </Form.Item>
        <Form.Item
          n-mobxField={formData.month}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
          <Input placeholder="Input birth month" />
        </Form.Item>
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
