function setTmplConfig(opts) {
  if (nj._alreadySetConfigs) {
    return;
  }

  if (opts.extensionConfig) {
    let extensionConfig = {},
      extensionConfigs = opts.extensionConfig;
    if (!Array.isArray(extensionConfigs)) {
      extensionConfigs = [extensionConfigs];
    }

    nj.each(extensionConfigs, exConfig => {
      nj.each(exConfig, (v, k) => {
        extensionConfig[k] = {
          options: v
        };
      });
    });
    nj.registerExtension(extensionConfig, null, null, true);
  }
  if (opts.filterConfig) {
    let filterConfig = {},
      filterConfigs = opts.filterConfig;
    if (!Array.isArray(filterConfigs)) {
      filterConfigs = [filterConfigs];
    }

    nj.each(filterConfigs, fConfig => {
      nj.each(fConfig, (v, k) => {
        filterConfig[k] = {
          options: v
        };
      });
    });
    nj.registerFilter(filterConfig, null, null, true);
  }

  nj._alreadySetConfigs = true;
}

function lowerFirst(str) {
  return str[0].toLowerCase() + str.substr(1);
}

module.exports = {
  setTmplConfig,
  lowerFirst
};