nj.registerFilter("isCurrent", function (obj) {
    return obj === this.data[1].filter;
});

nj.registerFilter("isActive", function (obj) {
    return obj === "Active";
});

nj.registerFilter("textDecoration", function (obj) {
    return obj ? 'line-through' : 'none';
});

nj.registerFilter("cursor", function (obj) {
    return obj ? 'default' : 'pointer';
});