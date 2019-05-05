import nj from './core';

export default function (configs) {
  const {
    createElement,
    outputH
  } = configs;

  if (createElement) {
    nj.createElement = createElement;
  }

  if (outputH != null) {
    nj.outputH = outputH;
  }
};