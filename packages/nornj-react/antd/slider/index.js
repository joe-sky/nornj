import { registerComponent } from 'nornj';
import { Slider } from 'antd';

registerComponent({
  'ant-Slider': {
    component: Slider,
    options: props => ({
      fieldDefaultRule: {
        type: props && props.range ? 'array' : 'number'
      }
    })
  }
});

export default Slider;
