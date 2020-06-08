import { registerComponent } from 'nornj';
import { TimePicker } from 'antd';

registerComponent({
  'ant-TimePicker': {
    component: TimePicker,
    options: {
      fieldDefaultRule: {
        type: 'date'
      }
    }
  }
});

export default TimePicker;
