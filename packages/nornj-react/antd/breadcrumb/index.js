import { registerComponent } from 'nornj';
import Breadcrumb from 'antd/lib/breadcrumb';

registerComponent({
  'ant-Breadcrumb': Breadcrumb,
  'ant-BreadcrumbItem': Breadcrumb.Item
});

export default Breadcrumb;
