'use strict';

//Converts any value to the parameter of NornJ template can be parsed.
module.exports = function (obj) {
  return {
    _njShim: obj
  };
};