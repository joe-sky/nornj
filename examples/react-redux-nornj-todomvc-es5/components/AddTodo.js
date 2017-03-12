nj.registerComponent('AddTodo', React.createClass({
  propTypes: {
    onAddClick: React.PropTypes.func.isRequired
  },

  template: nj.compileH(document.getElementById('template-addTodo').innerHTML),

  handleClick: function (e) {
    var node = this.refs.input;
    var text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  },

  render: function () {
    return this.template({ handleClick: this.handleClick });
  }
}));