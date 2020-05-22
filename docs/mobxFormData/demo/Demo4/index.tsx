import React from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import './style.less';
import nj from 'nornj';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
  }
};

let count = 0;

export default () => {
  const { formData } = useLocalStore(() => <MobxFormData />);

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

  let fieldName: string;

  return useObserver(() => (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} className="dynamic-form">
      <div>
        <each of={formData.fieldDatas} $key="fieldName">
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Passengers' : ''}
            required={false}
            key={fieldName}>
            <Form.Item n-mobxField={`formData[fieldName]`}>
              <Input placeholder="passenger name" style={{ width: '60%' }} />
              <if condition={formData.fieldDatas.size > 1}>
                <Icon
                  type="minus-circle"
                  className="dynamic-delete-button"
                  style={{ margin: '0 8px' }}
                  onClick={() => formData.delete(fieldName)}
                />
              </if>
            </Form.Item>
          </Form.Item>
        </each>
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => {
              formData.add(
                <MobxFieldData
                  name={`input_${count}`}
                  required
                  whitespace
                  message="Please input passenger's name or delete this field."
                />
              );

              count++;
            }}
            style={{ width: '60%' }}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
      </div>

      <Form.Item>
        <Button type="primary" onClick={onSubmit} n-style="margin-right:8">
          Submit
        </Button>
        <Button onClick={onReset}>Reset</Button>
      </Form.Item>
    </Form>
  ));
};
