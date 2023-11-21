#include <napi.h>
#include <cinttypes>

uint64_t fib(uint64_t n){
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

Napi::Number Fibonacci(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  int value = info[0].As<Napi::Number>();
  return Napi::Number::New(env, fib(value));
}

Napi::Number LinearSearch(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::ArrayBuffer arrayBuffer = info[0].As<Napi::ArrayBuffer>();
  int length = arrayBuffer.ByteLength() / sizeof(int32_t);
  int searchValue = info[1].As<Napi::Number>();
  int* array = reinterpret_cast<int32_t*>(arrayBuffer.Data());
  int result = linearSearch(array, length, searchValue);
  return Napi::Number::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "Fibonacci"),
              Napi::Function::New(env, Fibonacci));
  exports.Set(Napi::String::New(env, "LinearSearch"),
	      Napi::Function::New(env, LinearSearch));
  return exports;
}

NODE_API_MODULE(addon, Init)
