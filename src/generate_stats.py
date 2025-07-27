import pandas as pd
import json
import argparse
import math

def procesar_csv(nombre_tecnologia, path_csv):
    df = pd.read_csv(path_csv)
    df.rename(columns={"Algorithm": "algorithm", "Input": "input", "Time": "time_ms", "Date": "date"}, inplace=True)

    resultados = []

    for (alg, input_val), group in df.groupby(["algorithm", "input"]):
        tiempos = group["time_ms"]
        mean = tiempos.mean()
        std = tiempos.std()
        min_val = tiempos.min()
        max_val = tiempos.max()
        count = tiempos.count()
        median = tiempos.median()
        coef_var = std / mean if mean != 0 else None
        ic_95 = 1.96 * std / math.sqrt(count) if count > 1 else None

        resultados.append({
            "technology": nombre_tecnologia,
            "algorithm": alg,
            "input": int(input_val),
            "mean_time_ms": mean,
            "std_dev_ms": std,
            "min_time_ms": min_val,
            "max_time_ms": max_val,
            "median_time_ms": median,
            "coef_var": coef_var,
            "ci_95_ms": ic_95,
            "samples": int(count)
        })

    return resultados

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csvs", nargs="+", help="Lista de pares tecnologia=archivo.csv", required=True)
    parser.add_argument("--out", default="fibonacci_stats.json", help="Archivo de salida JSON")
    args = parser.parse_args()

    all_stats = []
    for tech_pair in args.csvs:
        tech, path = tech_pair.split("=", 1)
        all_stats.extend(procesar_csv(tech, path))

    with open(args.out, "w") as f:
        json.dump(all_stats, f, indent=2)