const { fibonacci, linearSearch, binarySearch, bubbleSort, Queue } = require(
  "./algorithm.js",
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
  assert(linearSearch(array, 7) == 6);
  assert(linearSearch(array, 33) == -1);
  console.log("LinearSearch tests passed");
}

function testBinarySearch() {
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(binarySearch(sortedArray, 7) == 6);
  assert(binarySearch(sortedArray, 33) == -1);
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
  const unsortedArray = [3, 9, 10, 8, 7, 5, 2, 6, 1, 4];
  const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const anotherSortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  bubbleSort(unsortedArray);
  assert(
    cmpArrays(unsortedArray, sortedArray),
    "test bubbleSort(unsortedArray)",
  );
  bubbleSort(anotherSortedArray);
  assert(
    cmpArrays(anotherSortedArray, sortedArray),
    "test bubbleSort(anotherSortedArray)",
  );
  console.log("BubbleSort tests passed");
}

function testQueue() {
  const queue = new Queue();
  assert(queue.isEmpty(), "queue is empty");
  assert(queue.push(8) === 0, "push(8)");
  assert(!queue.isEmpty(), "queue is not empty");
  assert(queue.push(6) === 1, "push(6)");
  assert(queue.peek() === 8, "peek()===8");
  assert(queue.push(5) === 2, "push(5)");
  assert(cmpArrays(queue.items, [8, 6, 5]), "queue elements");
  assert(queue.pop() === 8, "pop 8");
  assert(queue.peek() === 6, "peek()===6");
  assert(cmpArrays(queue.items, [6, 5]), "pop 8 cmp");
  assert(queue.pop() === 6, "pop 6");
  assert(!queue.isEmpty(), "queue not is empty");
  assert(queue.pop() === 5, "pop 5");
  assert(queue.isEmpty(), "queue is empty");
  assert(cmpArrays(queue.items, []), "queue elements");
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
