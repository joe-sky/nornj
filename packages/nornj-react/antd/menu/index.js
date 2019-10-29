import { registerComponent } from 'nornj';
import Menu from 'antd/lib/menu';

registerComponent({
  'ant-Menu': Menu,
  'ant-SubMenu': Menu.SubMenu,
  'ant-MenuItemGroup': Menu.ItemGroup,
  'ant-MenuItem': Menu.Item
});

export default Menu;
