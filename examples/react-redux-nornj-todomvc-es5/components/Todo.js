njr.registerTmpl('Todo', '#template-todo')(React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired,
    completed: React.PropTypes.bool.isRequired
  },

  template: nj.compileH(document.getElementById('template-todo').innerHTML),

  click: function () {
    this.props.onClick(this.props.index);
  },

  render: function () {
    return this.template(this.props, this);
  }
}));