import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { useLocalStore, useObserver } from 'mobx-react-lite';

const { Option } = Select;

interface PriceValue {
  number?: number;
  currency?: 'rmb' | 'dollar';
}

interface PriceInputProps {
  value?: PriceValue;
  onChange?: (value: PriceValue) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
  const state = useLocalStore(() => ({
    _number: value?.number,
    get number() {
      return this._number;
    },
    set number(newNumber) {
      newNumber = parseInt((newNumber || 0) + '', 10);
      if (Number.isNaN(newNumber)) {
        return;
      }
      this._number = newNumber;
    },
    currency: value?.currency
  }));

  const triggerChange = () => {
    if (onChange) {
      onChange({ number: state.number, currency: state.currency });
    }
  };

  return useObserver(() => (
    <span>
      <Input mobxBind={state.number} onChange={triggerChange} style={{ width: 100 }} />
      <Select mobxBind={state.currency} style={{ width: 80, margin: '0 8px' }} onChange={triggerChange}>
        <Option value="rmb">RMB</Option>
        <Option value="dollar">Dollar</Option>
      </Select>
    </span>
  ));
};

export default props => {
  const checkPrice = (rule, value) => {
    if (value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject('Price must be greater than zero!');
  };

  const { formData } = useLocalStore(() => (
    <mobxFormData>
      <mobxFieldData
        name="price"
        value={{
          number: 0,
          currency: 'rmb'
        }}
        type="object"
        validator={checkPrice}
      />
    </mobxFormData>
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

  return useObserver(() => (
    <Form layout="inline">
      <Form.Item label="Price" mobxField={formData.price}>
        <PriceInput />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  ));
};
