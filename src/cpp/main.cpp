#include <iostream>
#include <chrono>
#include <vector>
#include <fstream>
#include <string>
#include <sstream>
#include <iomanip>
#include <ctime>
#include "algorithm.h"

std::vector<std::pair<int, double>> benchmark(int (*algorithm)(int), const std::vector<int>& inputs) {
    std::vector<std::pair<int, double>> results;
    for (int input : inputs) {
        auto start = std::chrono::high_resolution_clock::now();
        algorithm(input);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;
        results.emplace_back(input, duration.count());
    }
    return results;
}

std::string getCurrentDateTime() {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
    std::tm now_tm;
    localtime_r(&now_time_t, &now_tm); // Específico POSIX

    std::ostringstream oss;
    oss << std::put_time(&now_tm, "%Y%m%dT%H%M");
    return oss.str();
}

void exportToCSV(const std::vector<std::pair<int, double>>& results, const std::string& algorithmName) {
    std::string dateTime = getCurrentDateTime();
    std::string filename = "../../dataset/" + algorithmName + "_cpp--" + dateTime + ".csv";
    std::ofstream file(filename);

    if (file.is_open()) {
        file << "Algoritmo,Entrada,Tiempo\n";
        for (const auto& result : results) {
            file << algorithmName << "," << result.first << "," << result.second << "\n";
        }
        file.close();
        std::cout << "Benchmark completado y resultados exportados a " << filename << std::endl;
    } else {
        std::cerr << "No se pudo abrir el archivo " << filename << std::endl;
    }
}

int main() {
    std::vector<int> inputs;
    for (int i = 0; i <= 47; ++i) {
        inputs.push_back(i);
    }

    auto results = benchmark(fib, inputs);
    exportToCSV(results, "fibonacci");
    return 0;
}