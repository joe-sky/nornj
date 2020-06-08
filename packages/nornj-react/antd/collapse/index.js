import { registerComponent } from 'nornj';
import { Collapse } from 'antd';

registerComponent({
  'ant-Collapse': Collapse,
  'ant-CollapsePanel': Collapse.Panel
});

export default Collapse;
