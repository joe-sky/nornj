import { registerComponent } from 'nornj';
import Switch from 'antd/lib/switch';

registerComponent({
  'ant-Switch': {
    component: Switch,
    options: {
      valuePropName: 'checked'
    }
  }
});

export default Switch;
