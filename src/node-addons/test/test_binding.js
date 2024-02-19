const { fibonacci, linearSearch, binarySearch, bubbleSort, Queue } = require(
  "../lib/binding.js",
);
const assert = require("assert");

function testFibonacci() {
  assert(fibonacci(0) == 0);
  assert(fibonacci(1) == 1);
  assert(fibonacci(2) == 1);
  assert(fibonacci(3) == 2);
  assert(fibonacci(4) == 3);
  assert(fibonacci(5) == 5);
  assert(fibonacci(10) == 55);
  console.log("Fibonacci tests passed");
}

function testLinearSearch() {
  const array = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(linearSearch(array.buffer, 7) == 6);
  assert(linearSearch(array.buffer, 33) == -1);
  console.log("LinearSearch tests passed");
}

function testBinarySearch() {
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(binarySearch(sortedArray.buffer, 7) == 6);
  assert(binarySearch(sortedArray.buffer, 33) == -1);
  console.log("BinarySearch tests passed");
}

function cmpArrays(x, y) {
  if (x.length !== y.length) {
    return false;
  } else {
    for (let i = 0; i < x.length; i++) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  }
}

function testBubbleSort() {
  const unsortedArray = new Int32Array([3, 9, 10, 8, 7, 5, 2, 6, 1, 4]);
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const anotherSortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  bubbleSort(unsortedArray.buffer);
  assert(cmpArrays(unsortedArray, sortedArray));
  bubbleSort(anotherSortedArray.buffer);
  assert(cmpArrays(anotherSortedArray, sortedArray));
  console.log("BubbleSort tests passed");
}

function testQueue() {
  const queue = new Queue();
  assert(queue.isEmpty());
  assert(queue.push(8) === 0);
  assert(queue.peek() === 8);
  assert(!queue.isEmpty());
  assert(queue.push(6) === 1);
  assert(queue.push(5) === 2);
  assert(queue.peek() === 8);
  assert(queue.pop() === 8);
  assert(queue.peek() === 6);
  assert(queue.pop() === 6);
  assert(!queue.isEmpty());
  assert(queue.pop() === 5);
  assert(queue.isEmpty());
  console.log("Queue tests passed");
}

function main() {
  testFibonacci();
  testLinearSearch();
  testBinarySearch();
  testBubbleSort();
  testQueue();
  console.log("Tests passed- everything looks OK!");
}

main();
