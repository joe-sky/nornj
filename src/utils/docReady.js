'use strict';

module.exports = function (callback) {
  var doc = document;
  if (doc.addEventListener) {
    doc.addEventListener("DOMContentLoaded", callback, false);
  }
  else {
    self.attachEvent("onload", callback);
  }
};