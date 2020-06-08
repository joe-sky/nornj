import { registerComponent } from 'nornj';
import { Switch } from 'antd';

registerComponent({
  'ant-Switch': {
    component: Switch,
    options: {
      valuePropName: 'checked'
    }
  }
});

export default Switch;
