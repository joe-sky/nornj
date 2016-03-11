var AddTodo = React.createClass({
  propTypes: {
    onAddClick: React.PropTypes.func.isRequired
  },

  template: nj.compileComponent(AddTodoTmpl),

  handleClick: function (e) {
    var node = this.refs.input;
    var text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  },

  render: function () {
    return this.template({ handleClick: this.handleClick });
  }
});

nj.registerComponent('AddTodo', AddTodo);