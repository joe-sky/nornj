import { registerComponent } from 'nornj';
import Checkbox from 'antd/lib/checkbox';
const CheckboxGroup = Checkbox.Group;

registerComponent({
  'ant-Checkbox': {
    component: Checkbox,
    options: {
      hasEventObject: true,
      valuePropName: 'checked',
      targetPropName: 'checked'
    }
  },
  'ant-CheckboxGroup': {
    component: CheckboxGroup,
    options: {
      needToJS: true,
      fieldDefaultRule: {
        type: 'array'
      }
    }
  }
});

export default Checkbox;
