import { compileComponent, registerComponent } from '../../../../src/base.js';
import Component from 'inferno-component';
import tmpl from './template';
const template = compileComponent(tmpl);

class TestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    }
  }

  render() {
    return template(
      this.props,
      this.state,
      { onClick: ()=> this.setState({ counter: Date.now() }) }
    );
  }
}

registerComponent({ TestComponent });
export default TestComponent;