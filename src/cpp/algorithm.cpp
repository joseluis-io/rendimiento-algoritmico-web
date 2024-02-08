#include "algorithm.h"
#include <algorithm>
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

void bubbleSort(int array[], int length) {
  int i, j;
  bool swapped;
  for (i = 0; i < length - 1; i++) {
    swapped = false;
    for (j = 0; j < length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        std::swap(array[j], array[j + 1]);
        swapped = true;
      }
    }
    if (swapped == false) {
      break;
    }
  }
}

int Queue::push(int item) {
  this->items.push(item);
  return this->items.size() - 1;
}

int Queue::pop() {
  int item = this->items.front();
  this->items.pop();
  return item;
}

int Queue::peek() { return this->items.front(); }
bool Queue::isEmpty() { return this->items.empty(); }
