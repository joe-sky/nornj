import { registerComponent } from 'nornj';
import Tabs from 'antd/lib/tabs';

registerComponent({
  'ant-Tabs': Tabs,
  'ant-TabPane': Tabs.TabPane
});

export default Tabs;
