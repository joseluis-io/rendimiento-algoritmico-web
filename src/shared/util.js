export class Environment {
    constructor() {
        const envInfo = this.detectEnvironment();
        this.env = envInfo.env;
        this.version = envInfo.version;
        this.ffi = "";
        this.strategy = this.createStrategy();
    }

    setFFI(type) {
        this.ffi = type;
    }

    detectEnvironment() {
        if (typeof Bun !== "undefined") {
            return { env: "Bun", version: Bun.version };
        }
        if (typeof Deno !== "undefined") {
            return { env: "Deno", version: Deno.version.deno };
        }
        if (typeof process !== "undefined" && process.versions.node) {
            return { env: "Node", version: process.versions.node };
        }
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            return this.detectBrowser();
        }
        throw new Error("Environment not suppported")
    }

    detectBrowser() {
        const userAgent = navigator?.userAgent;
        if (userAgent.includes("Chrome")) {
            return {
                env: "Chrome",
                version: navigator.userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || ""
            }
        }
        if (userAgent.includes("Firefox")) {
            return {
                env: "Firefox",
                version: navigator.userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || ""
            }
        }
        return {
            env: "Browser",
            version: "unknown",
        };
    }

    isBrowser() {
        return ["Browser", "Chrome", "Firefox"].includes(this.env);
    }

    createStrategy() {
        let environment = this.env;

        if (this.isBrowser()) {
            environment = "Browser";
        }

        const strategies = {
            "Bun": {
                handleFile: async (filename, content) => await Bun.write(filename, content),
                getWasmInstanceExports: async (pathOrUrl) => {
                    const wasmBinary = await Bun.file(pathOrUrl).arrayBuffer();
                    const res = await WebAssembly.instantiate(wasmBinary);
                    return res.instance.exports;
                }
            },
            "Deno": {
                handleFile: async (filename, content) => await Deno.writeTextFile(filename, content),
                getWasmInstanceExports: async (pathOrUrl) => {
                    const wasmBinary = await Deno.readFile(pathOrUrl);
                    const res = await WebAssembly.instantiate(wasmBinary);
                    return res.instance.exports;
                }
            },
            "Node": {
                handleFile: async (filename, content) => {
                    const fs = await import('node:fs/promises');
                    await fs.writeFile(filename, content);
                },
                getWasmInstanceExports: async (pathOrUrl) => {
                    const fs = await import('node:fs/promises');
                    const wasmBinary = await fs.readFile(pathOrUrl);
                    const res = await WebAssembly.instantiate(wasmBinary);
                    return res.instance.exports;
                }
            },
            "Browser": {
                handleFile: (filename, content) => {
                    const blob = new Blob([content], { type: "text/plain" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.textContent = `Descargar ${filename}`;
                    link.style.display = "block";
                    document.body.appendChild(link);
                },
                getWasmInstanceExports: async (pathOrUrl) => {
                    const res = await WebAssembly.instantiateStreaming(fetch(pathOrUrl));
                    return res.instance.exports;
                },
            },
        }

        if (!strategies[environment]) {
            throw new Error(`Strategy for ${this.env} not found`);
        }

        return strategies[environment];
    }

    handleFile(filename, content) {
        try {
            this.strategy.handleFile(filename, content);
        } catch (error) {
            console.error(`Error handling file ${filename}: ${error.message}`);
            throw new Error(`Failed to handle file in ${this.env} environment: ${error.message}`);
        }
    }

    getWasmInstanceExports(pathOrUrl) {
        try {
            return this.strategy.getWasmInstanceExports(pathOrUrl);
        } catch (error) {
            console.error(`Error loading WASM from ${pathOrUrl}: ${error.message}`);
            throw new Error(`Failed to load WASM in ${this.env} environment: ${error.message}`);
        }
    }
}

// formato: YYYYMMDDTHHMM
function getCurrentDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}`;
}

export async function exportToCSV(results, algorithmName, environment) {
    const dateTime = getCurrentDateTime();
    let filename = `../../dataset/${algorithmName}_${environment.env}_${environment.ffi}.${environment.version}--${dateTime}.csv`;
    if (environment.isBrowser()) {
        filename = `${algorithmName}_${environment.env}_${environment.ffi}.${environment.version}--${dateTime}.csv`
    }

    const header = 'Algorithm,Input,Time\n';
    const rows = results.map(result => `${result.algorithm},${result.input},${result.time}`).join('\n');
    const csvContent = header + rows;

    console.log(csvContent)
    console.table(results)
    await environment.handleFile(filename, csvContent);
    console.log(filename)
}