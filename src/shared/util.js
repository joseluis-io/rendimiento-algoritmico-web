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
                handleFile: async (filename, content) => {
                    const fs = await import('node:fs/promises');
                    await fs.appendFile(filename, content);
                },
                getWasmInstanceExports: async (pathOrUrl) => {
                    const wasmBinary = await Bun.file(pathOrUrl).arrayBuffer();
                    const res = await WebAssembly.instantiate(wasmBinary);
                    return res.instance.exports;
                },
                fileExists: async (filename) => {
                    try {
                        const file = Bun.file(filename);
                        return await file.exists();
                    } catch {
                        return false;
                    }
                },
                getAlgorithmArg: () => {
                    return Bun.argv.find(a => a.startsWith("--alg="))?.split("=")[1] ?? "all";
                }
            },
            "Deno": {
                handleFile: async (filename, content) => await Deno.writeTextFile(filename, content, { append: true }),
                getWasmInstanceExports: async (pathOrUrl) => {
                    const wasmBinary = await Deno.readFile(pathOrUrl);
                    const res = await WebAssembly.instantiate(wasmBinary);
                    return res.instance.exports;
                },
                fileExists: async (filename) => {
                    try {
                        const stat = await Deno.stat(filename);
                        return stat.isFile;
                    } catch (error) {
                        if (error instanceof Deno.errors.NotFound) {
                            return false;
                        }
                        throw error;
                    }
                },
                getAlgorithmArg: () => {
                    const arg = Deno.args.find(arg => arg.startsWith("--alg="));
                    return arg ? arg.split("=")[1] : "all";
                }
            },
            "Node": {
                handleFile: async (filename, content) => {
                    const fs = await import('node:fs/promises');
                    await fs.appendFile(filename, content);
                },
                getWasmInstanceExports: async (pathOrUrl) => {
                    const fs = await import('node:fs/promises');
                    const wasmBinary = await fs.readFile(pathOrUrl);
                    const res = await WebAssembly.instantiate(wasmBinary);
                    return res.instance.exports;
                },
                fileExists: async (filename) => {
                    try {
                        const fs = await import('node:fs/promises');
                        await fs.access(filename);
                        return true;
                    } catch {
                        return false;
                    }
                },
                getAlgorithmArg: () => {
                    const arg = process.argv.find(arg => arg.startsWith("--alg="));
                    return arg ? arg.split("=")[1] : "all";
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
                fileExists: async (filename) => {
                    return false;
                },
                getAlgorithmArg: () => {
                    const params = new URLSearchParams(window.location.search);
                    return params.get("alg") ?? "all";
                }
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

    fileExists(filename) {
        try {
            return this.strategy.fileExists(filename);
        } catch (error) {
            console.error(`Error checking file from ${filename}: ${error.message}`);
            throw new Error(`Failed to check file in ${this.env} environment: ${error.message}`);
        }
    }

    getAlgorithmArg() {
        try {
            return this.strategy.getAlgorithmArg();
        } catch (error) {
            console.error(`Error getting arguments: ${error.message}`);
            throw new Error(`Failed to get argument in ${this.env} environment: ${error.message}`);
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

export async function exportToCSV(results, algorithmName, environment, debug = false) {
    const dateTime = getCurrentDateTime();
    let filename = `../../dataset/${algorithmName}/${environment.env}_${environment.ffi}.${environment.version}_${algorithmName}.csv`;
    if (environment.isBrowser()) {
        filename = `${environment.env}_${environment.ffi}.${environment.version}_${algorithmName}--${dateTime}.csv`
    }

    const rows = results.map(result => `${result.algorithm},${result.input},${result.time},${dateTime}`).join('\n');

    const fileExists = await environment.fileExists(filename);
    let csvContent = '';

    if (!fileExists) {
        const header = 'Algorithm,Input,Time,Date\n';
        csvContent += header;
    }

    csvContent += rows + '\n';

    console.log(csvContent)
    if (debug == true) {
        console.table(results)
    }

    await environment.handleFile(filename, csvContent);

    console.log(filename + `\n`)
}

// const memory = new WebAssembly.Memory({
//     initial: 32768,
//     maximum: 32768, 
// });

// const importObject = {
//     env: {
//         memory, 
//     }
// };