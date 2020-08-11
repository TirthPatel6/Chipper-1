const CSV = require('../other_modules/csv.js');
const fs = require('fs');
const path = require("path");
const prompt = require('prompt-sync')();

const names = fs.readdirSync(path.resolve(__dirname, '../CSVs/unprocessed/'));
for (var filename of names) {
    try {
        var data = fs.readFileSync(path.resolve(__dirname, `../CSVs/unprocessed/${filename}`), 'utf8');
        processCSV(data.toString(), filename);    
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

const alljsons = {'names': fs.readdirSync(path.resolve(__dirname, '../partlibrary/enumerated/'))};
var final = JSON.stringify(alljsons, null, '    ');
fs.writeFileSync(path.resolve(__dirname, `../partlibrary/allenum.json`), final);
console.log('List of JSONs created!');

function processCSV(t, filename) {
    var out = CSV.parse(t);
    var data = {};
    for(var i = 1; i < out.length; i++) {
        data[out[i][0]] = {};
        var properties = data[out[i][0]];
        for(var j = 1; j < out[0].length; j++) {
            properties[out[0][j]] = out[i][j];
        }
    }
    
    var manufacturer = prompt(`(All lowercase) Manufacturer of ${filename}? `);
    console.dir(manufacturer);
    var partType = prompt(`(All lowercase) Type of part? `);
    console.dir(partType);

    var result = {};
    result['manufacturer'] = manufacturer;
    result['type'] = partType;
    result['data'] = data;

    var final = JSON.stringify(result, null, '    ');

    fs.writeFileSync(path.resolve(__dirname, `../partlibrary/enumerated/${path.parse(filename).name}.json`), final);
    console.log('Saved!');

    fs.renameSync(path.resolve(__dirname, `../CSVs/unprocessed/${filename}`), path.resolve(__dirname, `../CSVs/processed/${filename}`));
    console.log('Renamed!');
}