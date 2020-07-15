import { registerComponent } from 'nornj';
import { TreeSelect } from 'antd';

registerComponent({
  'ant-TreeSelect': TreeSelect,
  'ant-TreeNode': TreeSelect.TreeNode
});

export default TreeSelect;
