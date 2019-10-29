import { registerComponent } from 'nornj';
import Collapse from 'antd/lib/collapse';

registerComponent({
  'ant-Collapse': Collapse,
  'ant-CollapsePanel': Collapse.Panel
});

export default Collapse;
