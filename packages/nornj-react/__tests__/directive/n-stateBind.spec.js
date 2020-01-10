import React, { Component, useState } from 'react';
import { shallow, mount } from 'enzyme';
import nj, { html } from 'nornj';
import '../../src/base';

function putStateValue(value, ret) {
  return value.prop == 'state' ? ret : putStateValue(value.parent, { [value.prop]: ret });
}

nj.registerExtension(
  'stateBind',
  options => {
    const {
      tagProps,
      value,
      context: { $this }
    } = options;

    const _value = value();
    tagProps.value = _value.value;

    const _onChange = tagProps.onChange;
    tagProps.onChange = function(e) {
      $this.setState(putStateValue(_value, e.target.value), () => _onChange.apply($this, arguments));
    };
  },
  {
    isDirective: true,
    isBindable: true,
    useExpressionInProps: true
  }
);

class TestStateBind extends Component {
  state = {
    count: 100,
    foo: {
      count: 100
    },
    bar: {
      baz: {
        count: 100
      }
    }
  };

  render() {
    return (
      <div>
        <input ref="input" n-stateBind={this.state.foo.count} onChange={this.props.handleChange} />
      </div>
    );
  }
}

const testStateBindTemplate = html`
  <div>
    <input ref="input" n-stateBind="{this.state.foo.count}" onChange="{this.props.handleChange}" />
  </div>
`;

class TestStateBindTemplate extends Component {
  state = {
    count: 100,
    foo: {
      count: 100
    },
    bar: {
      baz: {
        count: 100
      }
    }
  };

  render() {
    return testStateBindTemplate(this);
  }
}

describe('n-stateBind directive', function() {
  it('should render n-stateBind', () => {
    const app = mount(<TestStateBind />);
    expect(app.find('input').props().value).toEqual(100);
  });

  it('should render n-stateBind by NornJ template', () => {
    const app = mount(<TestStateBindTemplate />);
    expect(app.find('input').props().value).toEqual(100);
  });

  it('responds to value change', () => {
    const spyHandleChange = jest.fn(e => console.log(e.target.value));
    const wrap = mount(<TestStateBind handleChange={spyHandleChange} />);

    const event = { target: { value: 200 } };
    wrap.find('input').simulate('change', event);
    wrap.update();

    expect(wrap.ref('input').value).toEqual('200');
    expect(spyHandleChange).toHaveBeenCalled();
  });
});
