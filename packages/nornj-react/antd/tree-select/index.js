import { registerComponent } from 'nornj';
import TreeSelect from 'antd/lib/tree-select';

registerComponent({
  'ant-TreeSelect': TreeSelect,
  'ant-TreeNode': TreeSelect.TreeNode
});

export default TreeSelect;
