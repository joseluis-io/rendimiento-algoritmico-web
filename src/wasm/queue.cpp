#include <emscripten/bind.h>
#include <queue>

using namespace emscripten;

float lerp(float a, float b, float t) { return (1 - t) * a + t * b; }

EMSCRIPTEN_BINDINGS(my_module)
{
  function("lerp", &lerp);
}

class MyClass {
public:
  MyClass(int x, std::string y)
    : x(x)
    , y(y)
  {}

  void incrementX() {
    ++x;
  }

  int getX() const { return x; }
  void setX(int x_) { x = x_; }

  static std::string getStringFromInstance(const MyClass& instance) {
    return instance.y;
  }

private:
  int x;
  std::string y;
};

// Binding code
EMSCRIPTEN_BINDINGS(my_class_example) {
  class_<MyClass>("MyClass")
    .constructor<int, std::string>()
    .function("incrementX", &MyClass::incrementX)
    .property("x", &MyClass::getX, &MyClass::setX)
    .property("x_readonly", &MyClass::getX)
    .class_function("getStringFromInstance", &MyClass::getStringFromInstance)
    ;
}


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

// std::queue<int> Queue::getItems(){
//   return items;
// }

int Queue::peek() { return this->items.front(); }
bool Queue::isEmpty() { return this->items.empty(); }

EMSCRIPTEN_BINDINGS(cola) {
  class_<Queue>("Queue")
    .constructor<>()
    .function("push", &Queue::push)
    .function("pop", &Queue::pop)
    .function("peek", &Queue::peek)
    .function("isEmpty", &Queue::isEmpty)
    // .function("getItems", &Queue::getItems)
    ;
}