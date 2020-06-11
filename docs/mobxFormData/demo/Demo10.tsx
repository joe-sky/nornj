import React from 'react';
import { Form, Select, InputNumber, Switch, Radio, Slider, Button, Upload, Rate, Checkbox, Row, Col } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useLocalStore } from 'mobx-react-lite';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export default props => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="select" required message="Please select your country!" />
      <MobxFieldData name="select-multiple" required message="Please select your favourite colors!" />
      <MobxFieldData name="input-number" value={3} required message="Please enter numbers 1 to 10!" />
      <MobxFieldData name="switch" />
      <MobxFieldData name="slider" value={20} />
      <MobxFieldData name="slider-range" value={[20, 40]} />
      <MobxFieldData name="radio-group" required />
      <MobxFieldData name="radio-button" required />
      <MobxFieldData name="checkbox-group" value={['A', 'B']} required />
      <MobxFieldData name="rate" value={3.5} max={4} required message="Please select rates 1 to 4!" />
      <MobxFieldData name="upload" required />
      <MobxFieldData name="dragger" required />
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

  return (
    <Form {...formItemLayout} n-style="max-width:600">
      <Form.Item label="Plain Text">
        <span className="ant-form-text">China</span>
      </Form.Item>
      <Form.Item label="Select" hasFeedback n-mobxField={formData.select}>
        <Select placeholder="Please select a country">
          <Option value="china">China</Option>
          <Option value="usa">U.S.A</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Select[multiple]" n-mobxField={`formData['select-multiple']`}>
        <Select mode="multiple" placeholder="Please select favourite colors">
          <Option value="red">Red</Option>
          <Option value="green">Green</Option>
          <Option value="blue">Blue</Option>
        </Select>
      </Form.Item>

      <Form.Item label="InputNumber" n-mobxField={`formData['input-number']`}>
        <InputNumber min={1} max={10} />
        <span className="ant-form-text"> machines</span>
      </Form.Item>

      <Form.Item label="Switch" n-mobxField={formData.switch}>
        <Switch />
      </Form.Item>

      <Form.Item label="Slider" n-mobxField={formData.slider}>
        <Slider
          marks={{
            0: 'A',
            20: 'B',
            40: 'C',
            60: 'D',
            80: 'E',
            100: 'F'
          }}
        />
      </Form.Item>

      <Form.Item label="Slider[range]" n-mobxField={`formData['slider-range']`}>
        <Slider
          marks={{
            0: 'A',
            20: 'B',
            40: 'C',
            60: 'D',
            80: 'E',
            100: 'F'
          }}
          range
        />
      </Form.Item>

      <Form.Item label="Radio.Group" n-mobxField={`formData['radio-group']`}>
        <Radio.Group>
          <Radio value="a">item 1</Radio>
          <Radio value="b">item 2</Radio>
          <Radio value="c">item 3</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Radio.Button" n-mobxField={`formData['radio-button']`}>
        <Radio.Group>
          <Radio.Button value="a">item 1</Radio.Button>
          <Radio.Button value="b">item 2</Radio.Button>
          <Radio.Button value="c">item 3</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Checkbox.Group" n-mobxField={`formData['checkbox-group']`}>
        <Checkbox.Group>
          <Row>
            <Col span={8}>
              <Checkbox value="A" style={{ lineHeight: '32px' }}>
                A
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="B" style={{ lineHeight: '32px' }}>
                B
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="C" style={{ lineHeight: '32px' }}>
                C
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="D" style={{ lineHeight: '32px' }}>
                D
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="E" style={{ lineHeight: '32px' }}>
                E
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="F" style={{ lineHeight: '32px' }}>
                F
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item label="Rate" n-mobxField={formData.rate}>
        <Rate />
      </Form.Item>

      <Form.Item label="Upload" n-mobxField={formData.upload} extra="longgggggggggggggggggggggggggggggggggg">
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button>
            <UploadOutlined /> Click to upload
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Dragger" n-mobxField={formData.dragger}>
        <Upload.Dragger name="files" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Upload.Dragger>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
