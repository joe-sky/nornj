njr.registerTmpl('AddTodo', '#template-addTodo')(createReactClass({
  propTypes: {
    onAddClick: PropTypes.func.isRequired
  },

  handleClick: function(e) {
    var node = this.refs.input;
    var text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  },

  render: function() {
    return this.template({ handleClick: this.handleClick });
  }
}));