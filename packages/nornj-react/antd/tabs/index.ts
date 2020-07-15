import { registerComponent } from 'nornj';
import { Tabs } from 'antd';

registerComponent({
  'ant-Tabs': Tabs,
  'ant-TabPane': Tabs.TabPane
});

export default Tabs;
