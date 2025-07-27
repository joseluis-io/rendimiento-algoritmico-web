import json
import os
import matplotlib.pyplot as plt
import numpy as np

def generate_median_and_mean_std_plots_filtered(algorithm_data, algorithm_name, output_dir="plots"):
    os.makedirs(output_dir, exist_ok=True)
    
    grouped_data = {}
    for record in algorithm_data:
        input_size = record['input']
        tech = record['technology']
        if tech not in grouped_data:
            grouped_data[tech] = {'input': [], 'mean': [], 'std_dev': [], 'median': []}
        grouped_data[tech]['input'].append(input_size)
        grouped_data[tech]['mean'].append(record['mean_time_ms'])
        grouped_data[tech]['std_dev'].append(record.get('std_dev_ms') or 0)
        grouped_data[tech]['median'].append(record['median_time_ms'])

    # Plot mediana
    plt.figure(figsize=(10, 6))
    for tech, stats in grouped_data.items():
        plt.plot(stats['input'], stats['median'], marker='o', label=tech)
        # Añadir etiqueta en el último punto
        plt.text(stats['input'][-1], stats['median'][-1], f' {tech}', fontsize=8, verticalalignment='center')
    plt.title(f'{algorithm_name}: Mediana del Tiempo vs Tamaño de Entrada')
    plt.xlabel('Tamaño de Entrada')
    plt.ylabel('Mediana Tiempo (ms)')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f'{algorithm_name}_median.png'))
    plt.close()

    # Plot promedio + desviación estándar
    plt.figure(figsize=(10, 6))
    for tech, stats in grouped_data.items():
        std_dev_array = np.array(stats['std_dev'])
        if np.any(std_dev_array > 0):
            plt.errorbar(stats['input'], stats['mean'], yerr=std_dev_array, marker='o', label=tech, capsize=5)
            # Añadir etiqueta en el último punto
            plt.text(stats['input'][-1], stats['mean'][-1], f' {tech}', fontsize=8, verticalalignment='center')
    plt.title(f'{algorithm_name}: Promedio ± Desviación Estándar vs Tamaño de Entrada')
    plt.xlabel('Tamaño de Entrada')
    plt.ylabel('Tiempo Promedio (ms)')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f'{algorithm_name}_mean_std.png'))
    plt.close()

# === USO ===
files = {
    "binarySearch": "../stats/binarySearch_stats.json",
    "bubbleSort": "../stats/bubbleSort_stats.json",
    "fibonacci": "../stats/fibonacci_stats.json",
    "linearSearch": "../stats/linealSearch_stats.json",
    "queue": "../stats/queue_stats.json"
}

data = {}
for algo, path in files.items():
    with open(path, 'r') as f:
        data[algo] = json.load(f)

for algo_name, algo_data in data.items():
    generate_median_and_mean_std_plots_filtered(algo_data, algo_name)
