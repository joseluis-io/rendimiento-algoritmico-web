CC = clang++
CFLAGS = -Wall -g

test: assert_algorithms.o algorithm.o
	$(CC) $(CFLAGS) -o testAlgorithm assert_algorithms.o algorithm.o

testAlgorithms.o: testAlgorithms.cpp 
	$(CC) $(CFLAGS) -c testAlgorithms.cpp

algorithm.o: algorithm.h algorithm.cpp
	$(CC) $(CFLAGS) -c algorithm.cpp
