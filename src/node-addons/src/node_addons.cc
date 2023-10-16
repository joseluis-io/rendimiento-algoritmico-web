#include <napi.h>
#include <cinttypes>

uint64_t fib(uint64_t n){
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

Napi::Number Fibonacci(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  int value = info[0].As<Napi::Number>();
  return Napi::Number::New(env, fib(value));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "Fibonacci"),
              Napi::Function::New(env, Fibonacci));
  return exports;
}

NODE_API_MODULE(addon, Init)
