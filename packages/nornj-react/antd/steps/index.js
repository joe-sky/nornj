import { registerComponent } from 'nornj';
import { Steps } from 'antd';

registerComponent({
  'ant-Steps': Steps,
  'ant-Step': Steps.Step
});

export default Steps;
