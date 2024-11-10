const { fibonacci, linearSearch, binarySearch } = require("./lib/binding.js");
const fs = require('fs');

function benchmark(algorithm, inputs) {
    const results = [];
    for (const input of inputs) {
        const start = performance.now();
        algorithm(input);
        const end = performance.now();
        results.push({
            algorithm: algorithm.name,
            input: input,
            time: end - start
        });
    }
    return results;
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

function exportToCSV(results, algorithmName, environment) {
    const dateTime = getCurrentDateTime();
    const filename = `../../dataset/${algorithmName}_${environment}--${dateTime}.csv`;
    const header = 'Algorithm,Input,Time\n';
    const rows = results.map(result => `${algorithmName},${result.input},${result.time}`).join('\n');
    const csvContent = header + rows;
    fs.writeFileSync(filename, csvContent);
    console.log(`Resultados exportados al fichero: ${filename}`);
}

const inputs = Array.from({ length: 48 }, (_, i) => i);

const results = benchmark(fibonacci, inputs);

exportToCSV(results, 'fibonacci', "Node-CPP");