import { registerComponent } from 'nornj';
import Form from 'antd/lib/form';
const FormItem = Form.Item;

registerComponent({
  'ant-Form': Form,
  'ant-FormItem': FormItem
});

export default Form;
