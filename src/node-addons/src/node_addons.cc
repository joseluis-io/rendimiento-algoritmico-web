#include <cinttypes>
#include <cmath>
#include <napi.h>
#include <queue>

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

class Queue : public Napi::ObjectWrap<Queue> {
public:
  Queue(const Napi::CallbackInfo &);
  Napi::Value push(const Napi::CallbackInfo &);
  Napi::Value pop(const Napi::CallbackInfo &);
  Napi::Value peek(const Napi::CallbackInfo &);
  Napi::Value isEmpty(const Napi::CallbackInfo &);

  static Napi::Function GetClass(Napi::Env);

private:
  std::queue<int> items;
};

Queue::Queue(const Napi::CallbackInfo &info) : ObjectWrap(info) {
  Napi::Env env = info.Env();
}

Napi::Value Queue::push(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  int value = info[0].As<Napi::Number>();
  this->items.push(value);
  return Napi::Number::New(env, this->items.size() - 1);
}

Napi::Value Queue::pop(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  int item = this->items.front();
  this->items.pop();
  return Napi::Number::New(env, item);
}

Napi::Value Queue::peek(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return Napi::Number::New(env, this->items.front());
}

Napi::Value Queue::isEmpty(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return Napi::Boolean::New(env, this->items.empty());
}

Napi::Function Queue::GetClass(Napi::Env env) {
  return DefineClass(env, "Queue",
                     {
                         Queue::InstanceMethod("isEmpty", &Queue::isEmpty),
                         Queue::InstanceMethod("push", &Queue::push),
                         Queue::InstanceMethod("pop", &Queue::pop),
                         Queue::InstanceMethod("peek", &Queue::peek),
                     });
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
  exports.Set(Napi::String::New(env, "Queue"), Queue::GetClass(env));

  return exports;
}

NODE_API_MODULE(addon, Init)
