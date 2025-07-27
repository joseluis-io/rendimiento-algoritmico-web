#!/bin/bash

set -e

ALGORITHMS=("fib" "lineal" "binary" "bubble" "queue")
RUNTIMES=("node" "deno" "bun")
REPEATS=8
SLEEP_BETWEEN=2
BASE_DIR="$(cd "$(dirname "$0")" && pwd)/src"

run_section() {
  local path=$1
  local description=$2
  local runner_template=$3
  local full_path="$BASE_DIR/$path"

  if [ ! -d "$full_path" ]; then
    echo "Directorio no encontrado: $full_path"
    return
  fi

  echo ""
  echo "Ejecutando benchmarks en: $description"
  cd "$full_path" || return

  for alg in "${ALGORITHMS[@]}"; do
    for ((i=1; i<=REPEATS; i++)); do
      echo ""
      echo " [$description] Iteración $i — Ejecutando $alg..."
      eval "$runner_template=$alg"
      sleep $SLEEP_BETWEEN
    done
  done

  echo "Completado: $description"
}

### 1. JS puro
for runtime in "${RUNTIMES[@]}"; do
  if [ "$runtime" = "deno" ]; then
    run_section "js" "JS ($runtime)" "$runtime run --allow-read --allow-write benchmark.js --alg"
  else
    run_section "js" "JS ($runtime)" "$runtime benchmark.js --alg"
  fi
done

### 2. WASM
for runtime in "${RUNTIMES[@]}"; do
  if [ "$runtime" = "deno" ]; then
    run_section "wasm" "WASM ($runtime)" "$runtime run --allow-read --allow-write benchmark.js --alg"
  else
    run_section "wasm" "WASM ($runtime)" "$runtime benchmark.js --alg"
  fi
done

### 3. Deno + Rust (FFI)
run_section "deno-addons" "Deno + Rust" "deno run --allow-read --allow-write --allow-ffi main.js --alg"

### 4. Node + C++
run_section "node-addons" "Node + C++" "npm run main -- --alg"
  
echo ""
echo "Todos los benchmarks completados correctamente ($REPEATS repeticiones por algoritmo)."