import { registerComponent } from 'nornj';
import { Select } from 'antd';
const Option = Select.Option,
  OptGroup = Select.OptGroup;

registerComponent({
  'ant-Select': {
    component: Select,
    options: props => {
      if (props && props.mode == 'multiple') {
        return {
          fieldDefaultRule: {
            type: 'array'
          }
        };
      }
      return {};
    }
  },
  'ant-Option': Option,
  'ant-OptGroup': OptGroup
});

export default Select;
