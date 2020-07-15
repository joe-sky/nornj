import { registerComponent } from 'nornj';
import { List } from 'antd';

registerComponent({
  'ant-List': List,
  'ant-ListItem': List.Item
});

export default List;
