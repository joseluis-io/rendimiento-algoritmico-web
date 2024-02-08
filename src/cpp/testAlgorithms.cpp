#include "algorithm.h"
#include <cassert>
#include <iostream>
#include <queue>

void testFibonacci() {
  assert(fib(0) == 0);
  assert(fib(1) == 1);
  assert(fib(2) == 1);
  assert(fib(3) == 2);
  assert(fib(4) == 3);
  assert(fib(5) == 5);
  assert(fib(10) == 55);
  std::cout << "Tests fibonacci OK" << std::endl;
}

void testLinearSearch() {
  int array[] = {1, 2, 3, 4, 5, 6, 7, 8};
  assert(linearSearch(array, 8, 7) == 6);
  assert(linearSearch(array, 8, 33) == -1);
  std::cout << "Tests linearSearch OK" << std::endl;
}

void testBinarySearch() {
  int sortedArray[] = {1, 2, 3, 4, 5, 6};
  assert(binarySearch(sortedArray, 6, 5) == 4);
  assert(binarySearch(sortedArray, 6, 33) == -1);
  std::cout << "Tests binarySearch OK" << std::endl;
}

bool cmpArrays(int x[], int y[], int length) {
  for (int i = 0; i < length; i++) {
    if (x[i] != y[i])
      return false;
  }
  return true;
}

void testBubbleSort() {
  int unsortedArray[] = {3, 9, 10, 8, 7, 5, 2, 6, 1, 4};
  int sortedArray[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  int anotherSortedArray[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  bubbleSort(unsortedArray, 10);
  assert(cmpArrays(unsortedArray, sortedArray, 10));
  bubbleSort(anotherSortedArray, 10);
  assert(cmpArrays(anotherSortedArray, sortedArray, 10));
  std::cout << "Tests bubbleSort OK" << std::endl;
}

void testQueue() {
  Queue queue = Queue();
  assert(queue.isEmpty());
  assert(queue.push(10) == 0);
  assert(!queue.isEmpty());
  assert(queue.push(11) == 1);
  assert(queue.peek() == 10);
  assert(queue.pop() == 10);
  assert(queue.peek() == 11);
  assert(queue.pop() == 11);
  assert(queue.isEmpty());
  std::cout << "Tests Queue OK" << std::endl;
}

int main() {
  testFibonacci();
  testLinearSearch();
  testBinarySearch();
  testBubbleSort();
  testQueue();
  std::cout << "Todos los tests han pasado" << std::endl;
  return 0;
}
