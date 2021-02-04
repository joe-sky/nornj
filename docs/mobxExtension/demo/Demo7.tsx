import React from 'react';
import { Form, Input, Select, Tooltip, Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { useFormData } from 'nornj-react/mobx/formData';

const { Option } = Select;

export default observer(props => {
  const formData = useFormData(() => (
    <mobxFormData>
      <mobxFieldData name="username" required message="Username is required" />
      <mobxFieldData name="province" required message="Province is required" />
      <mobxFieldData name="street" required message="Street is required" />
      <mobxFieldData name="year" required />
      <mobxFieldData name="month" required />
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
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }}>
      <Form.Item mobxField={formData.username} label="Username">
        <Input style={{ width: 160 }} placeholder="Please input" />
        <Tooltip title="Useful information">
          <a href="#API" style={{ margin: '0 8px' }}>
            Need Help?
          </a>
        </Tooltip>
      </Form.Item>

      <Form.Item label="Address" mobxField={`formData[['province', 'street']]`}>
        <Input.Group compact>
          <Select placeholder="Select province" mobxBind={formData.province}>
            <Option value="Zhejiang">Zhejiang</Option>
            <Option value="Jiangsu">Jiangsu</Option>
          </Select>
          <Input style={{ width: '50%' }} placeholder="Input street" mobxBind={formData.street} />
        </Input.Group>
      </Form.Item>

      <Form.Item label="BirthDate" style={{ marginBottom: 0 }} required>
        <Form.Item mobxField={formData.year} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
          <Input placeholder="Input birth year" />
        </Form.Item>
        <Form.Item
          mobxField={formData.month}
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
});
