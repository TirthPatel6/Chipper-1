const fs = require('fs');
const path = require("path");

var samsung = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../partlibrary/decoded/samsung.json")));
var micron = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../partlibrary/decoded/micron.json")));
var skhynix = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../partlibrary/decoded/skhynix.json")));


for (var manufacturer of [samsung, micron, skhynix]) {
    var partTitle = `<div class="partTitle">${manufacturer.partTitle}</div>`;
    var partNum = [];
    for (var x of manufacturer["partNum"]) {
        var chunk = Object.keys(x)[0]
        if(chunk == '-' || chunk == ':') {
            partNum.push(`<span>${chunk}</span>`);
        } else {
            partNum.push(`<data>${chunk}</data>`);
        }
    }
    partNum = ['<div class="partNum">', ...partNum, '</div>'];

    var partContent = [];
    for (var x of manufacturer["partNum"]) {
        var chunk = Object.keys(x)[0];
        var info = x[chunk];
        if (info !== null) {
            var category = Object.keys(info)[0];
            var options = info[category];
            partContent.push('<div>');
            partContent.push(`<b>${category}</b><br>`);
            for (const [key, value] of Object.entries(options)) {
                partContent.push(`${key}: ${value}<br>`);
            }
            partContent.push('</div>');
        }
    }
    partContent = ['<div class="partContent">', ...partContent, '</div>'];

    var myhtml = [`<div class="part" id="${manufacturer.manufacturer}">`, partTitle, ...partNum, ...partContent, '</div>'];
    myhtml = myhtml.join("\n");


    fs.writeFile(path.resolve(__dirname, `../_imports/${manufacturer.manufacturer}.html`), myhtml, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}