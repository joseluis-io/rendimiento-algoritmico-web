const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const linearSearch = (array, searchValue) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === searchValue) {
      return i;
    }
  }
  return -1;
};

const binarySearch = (array, searchValue) => {
  let l = 0;
  let r = array.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (array[m] < searchValue) {
      l = m + 1;
    } else if (array[m] > searchValue) {
      r = m - 1;
    } else {
      return m;
    }
  }
  return -1;
};

module.exports = {
  fibonacci,
  linearSearch,
  binarySearch,
};
