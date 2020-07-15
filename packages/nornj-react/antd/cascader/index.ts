import { registerComponent } from 'nornj';
import { Cascader } from 'antd';

registerComponent({
  'ant-Cascader': {
    component: Cascader,
    options: {
      needToJS: true
    }
  }
});

export default Cascader;
