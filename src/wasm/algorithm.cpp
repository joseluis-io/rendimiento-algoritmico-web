#include <cinttypes>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE
uint64_t fib(uint64_t n){
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

EXTERN EMSCRIPTEN_KEEPALIVE
int linearSearch(int array[], int length, int searchValue){
  for(int i = 0; i < length; i++){
    if(array[i] == searchValue){
      return i;
    }
  }
  return -1;
}

