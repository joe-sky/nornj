import { registerComponent } from 'nornj';
import TimePicker from 'antd/lib/time-picker';

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
