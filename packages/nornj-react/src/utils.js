import nj from 'nornj';

export function debounce(fn, delay) {
  let timeoutID = null;

  return function() {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

nj.assign(nj, {
  debounce
});
