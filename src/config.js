import nj from './core';
import createTmplRule from './utils/createTmplRule';

export default function (configs) {
  const delimiters = configs.delimiters,
    includeParser = configs.includeParser,
    createElement = configs.createElement,
    outputH = configs.outputH,
    textMode = configs.textMode;

  if(delimiters) {
    createTmplRule(delimiters, true);
  }

  if(includeParser) {
    nj.includeParser = includeParser;
  }

  if(createElement) {
    nj.createElement = createElement;
  }

  if(outputH != null) {
    nj.outputH = outputH;
  }

  if(textMode != null) {
    nj.textMode = textMode;
  }
};