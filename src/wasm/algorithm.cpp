#include <cinttypes>
#include <emscripten/emscripten.h>
#include <cmath>
#include <emscripten/bind.h>

using namespace emscripten;

#ifdef __cplusplus
extern "C" {
#endif

int fib(int n){
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

int linearSearch(int array[], int length, int searchValue){
  for(int i = 0; i < length; i++){
    if(array[i] == searchValue){
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

#ifdef __cplusplus
}
#endif