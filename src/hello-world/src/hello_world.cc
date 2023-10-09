#include <napi.h>

using namespace Napi;

Napi::String HelloWorld(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hola mundo desde C++");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "HelloWorld"),
              Napi::Function::New(env, HelloWorld));
  return exports;
}

NODE_API_MODULE(addon, Init)
