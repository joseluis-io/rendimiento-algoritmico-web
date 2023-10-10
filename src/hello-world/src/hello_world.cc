#include <napi.h>

using namespace Napi;

Napi::String HelloWorld(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hola mundo desde C++");
}


Napi::String ByeWorld(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Adios mundo desde C++");
}

Napi::Number MultiplyBy10(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  double arg0 = info[0].As<Napi::Number>().DoubleValue();
  return Napi::Number::New(env, arg0*10);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "HelloWorld"),
              Napi::Function::New(env, HelloWorld));
  exports.Set(Napi::String::New(env, "ByeWorld"),
              Napi::Function::New(env, ByeWorld));
  exports.Set(Napi::String::New(env, "MultiplyBy10"),
              Napi::Function::New(env, MultiplyBy10));
  return exports;
}

NODE_API_MODULE(addon, Init)
