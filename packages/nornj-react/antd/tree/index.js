import { registerComponent } from 'nornj';
import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;

registerComponent({
  'ant-Tree': Tree,
  'ant-TreeNode': TreeNode
});

export default Tree;
