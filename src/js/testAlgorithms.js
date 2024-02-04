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
  assert(queue.enqueue(8) === 0, "enqueue(8)");
  assert(!queue.isEmpty(), "queue not is empty");
  assert(queue.enqueue(6) === 1, "enqueue(6)");
  assert(queue.enqueue(5) === 2, "enqueue(5)");
  assert(queue.peek() === 8, "peek 8");
  assert(cmpArrays(queue.items, [8, 6, 5]), "queue elements");
  assert(queue.dequeue() === 8, "dequeue 8");
  assert(cmpArrays(queue.items, [6, 5]), "dequeue 8 cmp");
  assert(queue.dequeue() === 6, "dequeue 6");
  assert(!queue.isEmpty(), "queue not is empty");
  assert(queue.dequeue() === 5, "dequeue 5");
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
