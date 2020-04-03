import { registerComponent } from 'nornj';
import DatePicker from 'antd/lib/date-picker';

registerComponent({
  'ant-DatePicker': {
    component: DatePicker,
    options: {
      fieldDefaultRule: {
        type: 'date'
      }
    }
  },
  'ant-MonthPicker': {
    component: DatePicker.MonthPicker,
    options: {
      fieldDefaultRule: {
        type: 'date'
      }
    }
  },
  'ant-WeekPicker': {
    component: DatePicker.WeekPicker,
    options: {
      fieldDefaultRule: {
        type: 'date'
      }
    }
  },
  'ant-RangePicker': {
    component: DatePicker.RangePicker,
    options: {
      needToJS: true,
      fieldDefaultRule: {
        type: 'array'
      }
    }
  }
});

export default DatePicker;
