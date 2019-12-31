import nj, {
  registerExtension,
  ExtensionDelegateOption,
  Component as NjComponent,
  ComponentOption,
  Template
} from 'nornj';
import React, { Component } from 'react';
import { debounce } from '../utils';

interface IProps {
  debounceDirectiveOptions: ExtensionDelegateOption;
  DebounceTag: NjComponent;
  innerRef: React.Ref<any>;
}

class DebounceWrapClass extends Component<IProps> {
  private componentConfig: ComponentOption;
  private changeEventName: string;
  private $this: Template.ContextThis;
  private emitChangeDebounced: Function;

  constructor(props: IProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    const {
      debounceDirectiveOptions: {
        tagName,
        context: { $this },
        props: directiveProps,
        value
      }
    } = this.props;
    const args = directiveProps && directiveProps.arguments;

    this.componentConfig = nj.getComponentConfig(tagName) || {};
    this.changeEventName = (args && args[0].name) || this.componentConfig.changeEventName || 'onChange';
    this.$this = $this;
    this.emitChangeDebounced = debounce(this.emitChange, value() || 100);
  }

  componentDidUpdate(prevProps) {
    const {
      debounceDirectiveOptions: { value: prevValue }
    } = prevProps;
    const {
      debounceDirectiveOptions: { value }
    } = this.props;

    const newValue = value();
    if (newValue != null && newValue != prevValue()) {
      this.emitChangeDebounced = debounce(this.emitChange, newValue);
    }
  }

  handleChange(e: React.BaseSyntheticEvent) {
    // React pools events, so we read the value before debounce.
    // Alternately we could call `event.persist()` and pass the entire event.
    // For more info see reactjs.org/docs/events.html#event-pooling
    e && e.persist && e.persist();
    this.emitChangeDebounced(arguments);
  }

  emitChange = args => {
    this.props[this.changeEventName].apply(this.$this, args);
  };

  render() {
    const { DebounceTag, debounceDirectiveOptions, innerRef, ...others } = this.props;

    return (
      <DebounceTag
        ref={innerRef}
        {...others}
        {...{
          [this.changeEventName]: this.handleChange
        }}
      />
    );
  }
}

const DebounceWrap = React.forwardRef<any, IProps>((props, ref) => <DebounceWrapClass innerRef={ref} {...props} />);

registerExtension(
  'debounce',
  options => {
    const { tagName, setTagName, tagProps } = options;

    setTagName(DebounceWrap);
    tagProps.DebounceTag = tagName;
    tagProps.debounceDirectiveOptions = options;
  },
  { useExpressionInProps: true, onlyGlobal: true, isDirective: true }
);
