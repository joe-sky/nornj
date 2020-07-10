import React from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import './style.less';

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
  const { formData } = useLocalStore(() => <mobxFormData />);

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
            mobxField={`formData[fieldName]`}
            label={index === 0 ? 'Passengers' : ''}
            required={false}
            key={fieldName}>
            <Input placeholder="passenger name" style={{ width: '60%' }} />
            <if condition={formData.fieldDatas.size > 1}>
              <MinusCircleOutlined
                className="dynamic-delete-button"
                style={{ margin: '0 8px' }}
                onClick={() => formData.delete(fieldName)}
              />
            </if>
          </Form.Item>
        </each>
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => {
              formData.add(
                <mobxFieldData
                  name={`input_${count}`}
                  required
                  whitespace
                  message="Please input passenger's name or delete this field."
                />
              );

              count++;
            }}
            style={{ width: '60%' }}>
            <PlusCircleOutlined /> Add field
          </Button>
        </Form.Item>
      </div>

      <Form.Item>
        <Button type="primary" onClick={onSubmit} style={{ marginRight: 8 }}>
          Submit
        </Button>
        <Button onClick={onReset}>Reset</Button>
      </Form.Item>
    </Form>
  ));
};
