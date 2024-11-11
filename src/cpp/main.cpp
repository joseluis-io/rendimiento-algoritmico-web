#include <iostream>
#include <chrono>
#include <vector>
#include <fstream>
#include <string>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <random>
#include <algorithm>
#include <iterator>
#include "algorithm.h"

std::vector<std::pair<int, double>> benchmark(int (*algorithm)(int), const std::vector<int> &inputs)
{
    std::vector<std::pair<int, double>> results;
    for (int input : inputs)
    {
        auto start = std::chrono::high_resolution_clock::now();
        algorithm(input);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;
        results.emplace_back(input, duration.count());
    }
    return results;
}

int *generateOrderedArray(int size)
{
    int *array = new int[size];
    for (int i = 0; i < size; i++)
    {
        array[size] = i + 1;
    }
    return array;
}

std::vector<std::pair<int, double>> benchmarkLinearSearch(const std::vector<int> &sizes)
{
    std::vector<std::pair<int, double>> results;

    for (int size : sizes)
    {
        int *array = generateOrderedArray(size);
        int searchValue = size;

        auto start = std::chrono::high_resolution_clock::now();
        linearSearch(array, size, searchValue);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;

        results.emplace_back(size, duration.count());
        delete[] array;
    }

    return results;
}

std::vector<std::pair<int, double>> benchmarkBinarySearch(const std::vector<int> &sizes)
{
    std::vector<std::pair<int, double>> results;

    for (int size : sizes)
    {
        int *array = generateOrderedArray(size);
        int searchValue = size;

        auto start = std::chrono::high_resolution_clock::now();
        binarySearch(array, size, searchValue);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;

        results.emplace_back(size, duration.count());
        delete[] array;
    }

    return results;
}

int* generateUnorderedArray(int size)
{
    int* array = new int[size];
    for (int i = 0; i < size; ++i)
    {
        array[i] = i + 1;
    }

    // Baraja el array usando un generador de números aleatorio
    std::random_device rd;
    std::mt19937 g(rd());
    std::shuffle(array, array + size, g);

    return array;
}

std::vector<std::pair<int, double>> benchmarkBubbleSort()
{
    std::vector<std::pair<int, double>> results;
    std::vector<int> sizes = {100, 1000, 5000, 10000, 100000};

    for (int size : sizes)
    {
        int *array = generateUnorderedArray(size);
        int searchValue = size;
        auto start = std::chrono::high_resolution_clock::now();
        bubbleSort(array, size);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;

        results.emplace_back(size, duration.count());
        delete[] array;
    }

    return results;
}

void printArray(const int *array, int size)
{
    for (int i = 0; i < size; ++i)
    {
        std::cout << array[i] << " ";
    }
    std::cout << std::endl;
}

struct BenchmarkResult
{
    std::string algorithm;
    std::string input;
    double time;
};

std::vector<BenchmarkResult> benchmarkQueue()
{
    std::vector<int> sizes = {100, 1000, 5000, 10000, 100000, 1000000, 10000000};
    std::vector<BenchmarkResult> results;

    for (int size : sizes)
    {
        Queue queue;
        auto start = std::chrono::high_resolution_clock::now();

        for (int i = 0; i < size; ++i)
        {
            queue.push(i);
        }

        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;

        results.push_back({"Queue.push",
                           "size[" + std::to_string(size) + "]",
                           duration.count()});
    }

    return results;
}

void printResults(const std::vector<BenchmarkResult> &results)
{
    for (const auto &result : results)
    {
        std::cout << "Algorithm: " << result.algorithm
                  << ", Input: " << result.input
                  << ", Time: " << result.time << " ms"
                  << std::endl;
    }
}

std::string getCurrentDateTime()
{
    auto now = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
    std::tm now_tm;
    localtime_r(&now_time_t, &now_tm); // Específico POSIX

    std::ostringstream oss;
    oss << std::put_time(&now_tm, "%Y%m%dT%H%M");
    return oss.str();
}

void exportToCSV(const std::vector<std::pair<int, double>> &results, const std::string &algorithmName)
{
    std::string dateTime = getCurrentDateTime();
    std::string filename = "../../dataset/" + algorithmName + "_cpp--" + dateTime + ".csv";
    std::ofstream file(filename);

    if (file.is_open())
    {
        file << "Algoritmo,Entrada,Tiempo\n";
        for (const auto &result : results)
        {
            file << algorithmName << "," << result.first << "," << result.second << "\n";
        }
        file.close();
        std::cout << "Benchmark completado y resultados exportados a " << filename << std::endl;
    }
    else
    {
        std::cerr << "No se pudo abrir el archivo " << filename << std::endl;
    }
}

int main()
{
    std::vector<int> inputs;
    for (int i = 0; i <= 20; ++i)
    {
        inputs.push_back(i);
    }

    auto resultsFibonacci = benchmark(fib, inputs);
    // exportToCSV(resultsFibonacci, "fibonacci");

    std::vector<int> sizes = {100, 1000, 5000, 10000, 100000, 1000000, 10000000};
    std::vector<std::pair<int, double>> resultsLinear = benchmarkLinearSearch(sizes);

    std::cout << "Algorithm,Input Size,Time (ms)" << std::endl;
    for (const auto &result : resultsLinear)
    {
        std::cout << "Linear Search," << result.first << "," << result.second << std::endl;
    }

    std::vector<std::pair<int, double>> resultsBinary = benchmarkBinarySearch(sizes);

    std::cout << "Algorithm,Input Size,Time (ms)" << std::endl;
    for (const auto &result : resultsBinary)
    {
        std::cout << "Binary Search," << result.first << "," << result.second << std::endl;
    }

    
    std::vector<std::pair<int, double>> resultsBubbleSort = benchmarkBubbleSort();
    for (const auto &result : resultsBubbleSort)
    {
        std::cout << "BubbleSort," << result.first << "," << result.second << std::endl;
    }


    std::vector<BenchmarkResult> resultsQueue = benchmarkQueue();
    printResults(resultsQueue);

    return 0;
}