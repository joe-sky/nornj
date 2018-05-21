import nj from './core';

export default function (configs) {
  const createElement = configs.createElement,
    outputH = configs.outputH;

  if(createElement) {
    nj.createElement = createElement;
  }

  if(outputH != null) {
    nj.outputH = outputH;
  }
};