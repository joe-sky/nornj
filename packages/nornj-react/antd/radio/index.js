import { registerComponent } from 'nornj';
import Radio from 'antd/lib/radio';

registerComponent({
  'ant-Radio': Radio,
  'ant-RadioButton': Radio.Button,
  'ant-RadioGroup': {
    component: Radio.Group,
    options: {
      hasEventObject: true
    }
  }
});

export default Radio;
