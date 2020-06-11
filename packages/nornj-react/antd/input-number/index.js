import { registerComponent } from 'nornj';
import { InputNumber } from 'antd';

registerComponent({
  'ant-InputNumber': {
    component: InputNumber,
    options: {
      fieldDefaultRule: {
        type: 'number'
      }
    }
  }
});

export default InputNumber;
