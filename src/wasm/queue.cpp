#include <emscripten/bind.h>
#include <queue>

using namespace emscripten;

class Queue {
private:
  std::queue<int> items;

public:
  Queue(){ }
  int push(int item);
  int pop();
  int peek();
  bool isEmpty();
  // std::queue<int> getItems();
};


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

EMSCRIPTEN_BINDINGS(cola) {
  class_<Queue>("Queue")
    .constructor<>()
    .function("push", &Queue::push)
    .function("pop", &Queue::pop)
    .function("peek", &Queue::peek)
    .function("isEmpty", &Queue::isEmpty);
}