#include "algorithm.h"
#include <cmath>

uint64_t fib(uint32_t n) {
  if (n <= 1)
    return n;
  return fib(n - 1) + fib(n - 2);
}

int linearSearch(int array[], int length, int search) {
  for (int i = 0; i < length; i++) {
    if (array[i] == search) {
      return i;
    }
  }
  return -1;
}

int binarySearch(int sortedArray[], int length, int search) {
  int l = 0;
  int r = length - 1;
  while (l <= r) {
    int m = std::floor((l + r) / 2);
    if (sortedArray[m] < search) {
      l = m + 1;
    } else if (sortedArray[m] > search) {
      r = m - 1;
    } else {
      return m;
    }
  }
  return -1;
}
