import nj from 'nornj';

export function debounce(fn: Function, delay: number) {
  let timeoutID = null;

  return function(this: any) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

nj.assign(nj, {
  debounce
});
