import React, { Component, useState } from 'react';
import { shallow, mount } from 'enzyme';
import nj from 'nornj';
import '../../src/base';

function putStateValue(value, ret) {
  return value.prop == 'state' ? ret : putStateValue(value.parent, { [value.prop]: ret });
}

nj.registerExtension('stateBind', options => {
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
});

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

describe('n-stateBind directive', function() {
  it('should render n-stateBind', () => {
    const app = mount(<TestStateBind />);
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

nj.registerExtension('bind', options => {
  const { tagProps, value } = options;

  const [state, setState] = value().value;
  tagProps.value = state;

  const _onChange = tagProps.onChange;
  tagProps.onChange = function(e) {
    setState(e.target.value);
    _onChange.apply(null, arguments);
  };
});

function TestBind(props) {
  const $count = useState(100),
    [count] = $count;

  return (
    <div>
      <input ref={props.inputRef} n-bind={$count} onChange={props.handleChange} />
      {count}
    </div>
  );
}

describe('n-bind directive', function() {
  it('should render n-bind', () => {
    const app = mount(<TestBind />);
    expect(app.find('input').props().value).toEqual(100);
  });

  it('responds to name change', () => {
    const spyHandleChange = jest.fn(e => console.log(e.target.value));
    const ref = React.createRef();
    const wrap = mount(<TestBind handleChange={spyHandleChange} inputRef={ref} />);

    const event = { target: { value: 200 } };
    wrap.find('input').simulate('change', event);
    wrap.update();

    expect(ref.current.value).toEqual('200');
    expect(spyHandleChange).toHaveBeenCalled();
  });
});
