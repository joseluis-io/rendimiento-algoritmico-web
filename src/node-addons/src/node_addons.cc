#include <cinttypes>
#include <cmath>
#include <napi.h>

uint64_t fib(uint64_t n) {
  if (n <= 1)
    return n;
  return fib(n - 1) + fib(n - 2);
}

int linearSearch(int array[], int length, int searchValue) {
  for (int i = 0; i < length; i++) {
    if (array[i] == searchValue) {
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

Napi::Number Fibonacci(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  int value = info[0].As<Napi::Number>();
  return Napi::Number::New(env, fib(value));
}

Napi::Number LinearSearch(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::ArrayBuffer arrayBuffer = info[0].As<Napi::ArrayBuffer>();
  int length = arrayBuffer.ByteLength() / sizeof(int32_t);
  int searchValue = info[1].As<Napi::Number>();
  int *array = reinterpret_cast<int32_t *>(arrayBuffer.Data());
  int result = linearSearch(array, length, searchValue);
  return Napi::Number::New(env, result);
}

Napi::Number BinarySearch(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::ArrayBuffer arrayBuffer = info[0].As<Napi::ArrayBuffer>();
  int length = arrayBuffer.ByteLength() / sizeof(int32_t);
  int searchValue = info[1].As<Napi::Number>();
  int *array = reinterpret_cast<int32_t *>(arrayBuffer.Data());
  int result = binarySearch(array, length, searchValue);
  return Napi::Number::New(env, result);
}

void BubbleSort(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::ArrayBuffer arrayBuffer = info[0].As<Napi::ArrayBuffer>();
  int length = arrayBuffer.ByteLength() / sizeof(int32_t);
  int *array = reinterpret_cast<int32_t *>(arrayBuffer.Data());
  bubbleSort(array, length);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "Fibonacci"),
              Napi::Function::New(env, Fibonacci));
  exports.Set(Napi::String::New(env, "LinearSearch"),
              Napi::Function::New(env, LinearSearch));
  exports.Set(Napi::String::New(env, "BinarySearch"),
              Napi::Function::New(env, BinarySearch));
  exports.Set(Napi::String::New(env, "BubbleSort"),
              Napi::Function::New(env, BubbleSort));
  return exports;
}

NODE_API_MODULE(addon, Init)
