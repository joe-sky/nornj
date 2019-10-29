import { registerComponent } from 'nornj';
import Steps from 'antd/lib/steps';

registerComponent({
  'ant-Steps': Steps,
  'ant-Step': Steps.Step
});

export default Steps;
