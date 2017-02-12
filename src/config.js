import nj from './core';
import setTmplRule from './utils/setTmplRule';

export default function (configs) {
  const delimiters = configs.delimiters,
    includeParser = configs.includeParser,
    createElement = configs.createElement,
    outputH = configs.outputH;

  if(delimiters) {
    setTmplRule(delimiters);
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
};