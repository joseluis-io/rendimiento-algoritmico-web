#include <emscripten.h>

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE
int fib(int n){
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
