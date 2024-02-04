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

const bubbleSort = (array) => {
  let i, j, temp, swapped;
  for (i = 0; i < array.length - 1; i++) {
    swapped = false;
    for (j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swapped = true;
      }
    }
    if (swapped == false) {
      break;
    }
  }
};

class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.items[this.tail] = element;
    return this.tail++;
  }

  dequeue() {
    const item = this.items[this.head];
    this.items.splice(this.head, 1);
    this.tail--;
    return item;
  }

  peek() {
    return this.items[this.head];
  }

  isEmpty() {
    return this.tail === 0 && this.items.length === 0;
  }
}

module.exports = {
  fibonacci,
  linearSearch,
  binarySearch,
  bubbleSort,
  Queue,
};
