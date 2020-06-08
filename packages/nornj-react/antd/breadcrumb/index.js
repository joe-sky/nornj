import { registerComponent } from 'nornj';
import { Breadcrumb } from 'antd';

registerComponent({
  'ant-Breadcrumb': Breadcrumb,
  'ant-BreadcrumbItem': Breadcrumb.Item
});

export default Breadcrumb;
