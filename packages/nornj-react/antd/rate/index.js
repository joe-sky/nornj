import { registerComponent } from 'nornj';
import { Rate } from 'antd';

registerComponent({
  'ant-Rate': {
    component: Rate,
    options: {
      fieldDefaultRule: {
        type: 'number'
      }
    }
  }
});

export default Rate;
