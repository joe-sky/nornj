import { registerComponent } from 'nornj';
import { Form } from 'antd';
const FormItem = Form.Item;

registerComponent({
  'ant-Form': Form,
  'ant-FormItem': FormItem
});

export default Form;
