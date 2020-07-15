import { registerComponent } from 'nornj';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

registerComponent({
  'ant-Tree': Tree,
  'ant-TreeNode': TreeNode
});

export default Tree;
