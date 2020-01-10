import React, { Component, useState } from 'react';
import { shallow, mount } from 'enzyme';
import nj, { html } from 'nornj';
import '../../src/base';

nj.registerExtension(
  'bind',
  options => {
    const { tagProps, value, context } = options;

    const _value = value();
    tagProps.value = _value.value;

    const setter = context.getData(`set${nj.upperFirst(_value.prop)}`);
    const _onChange = tagProps.onChange;
    tagProps.onChange = function(e) {
      setter(e.target.value);
      _onChange.apply(null, arguments);
    };
  },
  {
    isDirective: true,
    isBindable: true,
    useExpressionInProps: true
  }
);

function TestBind(props) {
  const [count, setCount] = useState(100);

  return (
    <div>
      <input ref={props.inputRef} n-bind={count} onChange={props.handleChange} />
      {count}
    </div>
  );
}

const testBindTemplate = html`
  <div>
    <input ref="{inputRef}" n-bind="{count}" onChange="{handleChange}" />
    {count}
  </div>
`;

function TestBindTemplate(props) {
  const [count, setCount] = useState(100);

  return testBindTemplate(props, {
    count,
    setCount
  });
}

describe('n-bind directive', function() {
  it('should render n-bind', () => {
    const app = mount(<TestBind />);
    expect(app.find('input').props().value).toEqual(100);
  });

  it('should render n-bind by NornJ template', () => {
    const app = mount(<TestBindTemplate />);
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
