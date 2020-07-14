import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

@observer
class Demo extends Component {
  @observable formData = (
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
  ).formData;

  onGenderChange = value => {
    switch (value) {
      case 'male':
        this.formData.note = 'Hi, man!';
        return;
      case 'female':
        this.formData.note = 'Hi, lady!';
        return;
      case 'other':
        this.formData.note = 'Hi there!';
        return;
    }
  };

  onSubmit = () => {
    this.formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });
  };

  onReset = () => {
    this.formData.reset();
  };

  onFill = () => {
    this.formData.note = 'Hello world!';
    this.formData.gender = 'male';
  };

  render() {
    return (
      <Form {...layout} style={{ maxWidth: 600 }}>
        <Form.Item mobxField={this.formData.note} label="Note">
          <Input />
        </Form.Item>

        <Form.Item mobxField={this.formData.gender} label="Gender">
          <Select placeholder="Select a option and change input text above" onChange={this.onGenderChange} allowClear>
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>

        <if condition={this.formData.gender === 'other'}>
          <Form.Item mobxField={this.formData.customizeGender} label="Customize Gender">
            <Input />
          </Form.Item>
        </if>

        <Form.Item {...tailLayout}>
          <Button type="primary" onClick={this.onSubmit} style={{ marginRight: 8 }}>
            Submit
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={this.onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Demo;
