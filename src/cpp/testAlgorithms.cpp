#include "algorithm.h"
#include <cassert>
#include <iostream>

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

int main() {
  testFibonacci();
  testLinearSearch();
  testBinarySearch();
  std::cout << "Todos los tests han pasado" << std::endl;
  return 0;
}
