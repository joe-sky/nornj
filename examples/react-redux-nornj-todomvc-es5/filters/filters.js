nj.registerFilter([
  {
    name: 'isCurrent', filter: function (obj) {
      return obj === this.data[1].filter;
    }
  },
  {
    name: 'isActive', filter: function (obj) {
      return obj === "Active";
    }
  },
  {
    name: 'textDecoration', filter: function (obj) {
      return obj ? 'line-through' : 'none';
    }
  },
  {
    name: 'cursor', filter: function (obj) {
      return obj ? 'default' : 'pointer';
    }
  }
]);