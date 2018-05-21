njr.registerTmpl('Todo', '#template-todo')(createReactClass({
  propTypes: {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  },

  template: nj.compileH(document.getElementById('template-todo').innerHTML),

  click: function () {
    this.props.onClick(this.props.index);
  },

  render: function () {
    return this.template(this.props, this);
  }
}));