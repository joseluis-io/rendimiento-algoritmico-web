const libName = `./libalgorithm.so`;
import assert from "node:assert";
import { Queue } from "./queue.js";

// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
    "fib": { parameters: ["u64"], result: "u64" },
    "linearSearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "binarySearch": { parameters: ["buffer", "usize", "isize"], result: "i32" },
    "bubbleSort": { parameters: ["buffer", "usize"], result: "void" },
  } as const,
);

const { fib, linearSearch, binarySearch, bubbleSort } = dylib.symbols;

function testFibonacci() {
  assert(fib(0) == 0);
  assert(fib(1) == 1);
  assert(fib(2) == 1);
  assert(fib(3) == 2);
  assert(fib(4) == 3);
  assert(fib(5) == 5);
  assert(fib(10) == 55);
  console.log("Fibonacci tests passed");
}

function testLinearSearch() {
  const array = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(linearSearch(array, array.length, 7) == 6);
  assert(linearSearch(array, array.length, 33) == -1);
  console.log("LinearSearch tests passed");
}

function testBinarySearch() {
  const sortedArray = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  assert(binarySearch(sortedArray, sortedArray.length, 7) == 6);
  assert(binarySearch(sortedArray, sortedArray.length, 33) == -1);
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
  bubbleSort(unsortedArray, unsortedArray.length);
  assert(cmpArrays(unsortedArray, sortedArray), "bubbleSort(unsortedArray)");
  bubbleSort(anotherSortedArray, unsortedArray.length);
  assert(
    cmpArrays(anotherSortedArray, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    "bubbleSort(sortedArray)",
  );
  const sameNumbers = new Int32Array([3, 3, 3, 3]);
  bubbleSort(sameNumbers, sameNumbers.length);
  assert(
    cmpArrays(sameNumbers, [3, 3, 3, 3]),
    "bubbleSort(bubbleSort(sameNumbers))",
  );

  // TEST: worts case scenario with reversed 20 array
  const sorted10array = new Int32Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const reversed10array = new Int32Array([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  bubbleSort(reversed10array, reversed10array.length);
  assert(
    cmpArrays(reversed10array, sorted10array),
    "Test worst case sorting with 20 elements array"
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
  // assert(cmpArrays(queue.items, [8, 6, 5]), "queue elements");
  assert(queue.pop() === 8, "pop 8");
  assert(queue.peek() === 6, "peek()===6");
  // assert(cmpArrays(queue.items, [6, 5]), "pop 8 cmp");
  assert(queue.pop() === 6, "pop 6");
  assert(!queue.isEmpty(), "queue not is empty");
  assert(queue.pop() === 5, "pop 5");
  assert(queue.isEmpty(), "queue is empty");
  // assert(cmpArrays(queue.items, []), "queue elements");
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
