#include <cstdint>
#include <queue>

int fib(int n);
int linearSearch(int array[], int length, int search);
int binarySearch(int sortedArray[], int length, int search);
void bubbleSort(int array[], int length);

class Queue {
private:
  std::queue<int> items;

public:
  int push(int item);
  int pop();
  int peek();
  bool isEmpty();
};
