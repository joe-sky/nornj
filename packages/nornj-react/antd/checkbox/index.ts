import { registerComponent } from 'nornj';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

registerComponent({
  'ant-Checkbox': {
    component: Checkbox,
    options: {
      hasEventObject: true,
      valuePropName: 'checked',
      targetPropName: 'checked',
      fieldDefaultRule: {
        type: 'boolean'
      }
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
