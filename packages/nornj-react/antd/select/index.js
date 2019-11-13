import { registerComponent } from 'nornj';
import Select from 'antd/lib/select';
const Option = Select.Option,
  OptGroup = Select.OptGroup;

registerComponent({
  'ant-Select': Select,
  'ant-Option': Option,
  'ant-OptGroup': OptGroup
});

export default Select;
