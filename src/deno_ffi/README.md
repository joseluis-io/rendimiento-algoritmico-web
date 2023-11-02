Binarios Rust ejecutados en el entorno Deno.

Para la generación del binario y ejecución, introducir los siguientes comandos:
```
rustc --crate-type cdylib algorithm.rs
deno run --allow-ffi --unstable main.ts
```