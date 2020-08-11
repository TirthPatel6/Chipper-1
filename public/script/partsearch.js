// Helper Functions____________________________________________________________

async function getJSON(path) {
    var response = await fetch(path);
    var json = await response.json();
    return json;
}

function hamming_distance(string1, string2) {
	var dist_counter = Math.abs(string1.length - string2.length);
	for (var i = 0; i < Math.min(string1.length, string2.length); i++) {
        if (string1[i] != string2[i]) {
            dist_counter += 1;
        }
    }
    return dist_counter;
}



// Main module (keeps JSON data private)_______________________________________

const SearchModule = (async () => {
    const samsung = await getJSON("partlibrary/decoded/samsung.json");
    const skhynix = await getJSON("partlibrary/decoded/skhynix.json");
    const amdP = await getJSON("partlibrary/inexact/AMD_Processors.json");
    const amdG = await getJSON("partlibrary/inexact/AMD_Graphics.json");

    const allenum = await getJSON("partlibrary/allenum.json");
    var enumeratedParts = [];
    for (var i = 0; i < allenum.names.length; i++) {
        enumeratedParts[i] = await getJSON(`partlibrary/enumerated/${allenum.names[i]}`);
    }

    const startSearch = (partnumber) => {
        if (decodedSearch(partnumber) !== -1) return;
        if (enumeratedSearch(partnumber) !== -1) return;
        if (similarSearch(partnumber) !== -1) return;
        if (inexactSearch(partnumber) !== -1) return;

        document.getElementById("results").innerHTML = "No results found.";
        document.getElementById("decoders").style.display = "none";
        document.getElementById("results").style.display = "block";
    }

    function decodedSearch(partnumber) {
        for (var manufacturer of [samsung, skhynix]) {
            var myRegex = "^";
            for (var x of manufacturer["partNum"]) {
                var chunk = Object.keys(x)[0];
                if(chunk == "X".repeat(chunk.length)) {
                    var info = x[chunk];
                    var category = Object.keys(info)[0];
                    var options = info[category];
                    myRegex = myRegex.concat('(', Object.keys(options).join('|'), ')');
                } else {
                    myRegex = myRegex.concat("(", chunk, ")");
                }
            }
            myRegex = new RegExp(myRegex);
    
            var matches = partnumber.match(myRegex);
            if(!matches) continue;
            matches.shift();

            var i = 0;
            var lines = [];
            for (var x of manufacturer["partNum"]) {
                var chunk = Object.keys(x)[0];
                if((chunk != '-') && (chunk != ':')) {
                    var info = x[chunk];
                    var category = Object.keys(info)[0];
                    var options = info[category];
                    var description = options[matches[i]];
                    if(description) {
                        lines.push(`<b>${category}</b> &#8594; ${matches[i]}: ${description}`);
                    } else {
                        lines.push(`<b>${category}</b> &#8594; No data`);
                    }
                }
                i++;
            }
            displayPart(partnumber, manufacturer, lines);
            return;
        }
        return -1;
    }
    
    function enumeratedSearch(partnumber) {
        for (var manufacturer of enumeratedParts) {
            if(partnumber in manufacturer.data) {
                displayPart(partnumber, manufacturer);
                return;
            }
        }
        return -1;
    }
    
    function similarSearch(partnumber) {
        var partnums = enumeratedParts.map(x => Object.keys(x.data)).flat();
    
        var minstrings = [];
        var mindist = Infinity;
        for (var x of partnums) {
            var newdist = hamming_distance(partnumber, x);
            if (newdist < mindist) {
                mindist = newdist;
                minstrings = [x];
            } else if (newdist == mindist) {
                minstrings.push(x);
            }
        }
        if(mindist <= 4) {
            if(minstrings.length == 1) {
                document.getElementById("results").innerHTML = `Did you mean: ${minstrings}`;
            } else {
                document.getElementById("results").innerHTML = `Did you mean any of these? ${minstrings.join(', ')}`;
            }
            document.getElementById("decoders").style.display = "none";
            document.getElementById("results").style.display = "block";
        } else {
            return -1;         
        }
    }

    function inexactSearch(partnumber) {
        var documents = [];
        var i = 1;
        for (var manufacturer of [amdP, amdG]) {
            var data = manufacturer.data;
            var keys = Object.keys(data);
            for (var x of keys) {
                documents.push({'id': i,
                                'title': x,
                                'number': data[x]['OPN Tray'],
                                'manufacturer': manufacturer});
                i++;
            }
        }
    
        let miniSearch = new MiniSearch({
            fields: ['title', 'number', 'manufacturer'], // fields to index for full-text search
            storeFields: ['title', 'manufacturer']      // fields to return with search results
        });
          
        // Index all documents
        miniSearch.addAll(documents);
          
          // Search with default options
        var results = miniSearch.search(partnumber, { prefix: true });
        if (Array.isArray(results) && results.length) {
            var correctpart = results[0].title;
            var manufacturer = results[0].manufacturer;
            displayPart(correctpart, manufacturer);
            var html = "";
            for (var i=1; i <= 11; i++) {
                var correctpart = results[i].title;
                var manufacturer = results[i].manufacturer;
                var title = `<div class="other_results"><div class="infoTitle">${manufacturer.manufacturer} ${correctpart}</div></div>`;
                console.dir(title);
                html = html.concat(title);
            }
            console.dir(html);
            document.getElementById("other_results_container").innerHTML = html;
        } else {
            return -1;
        }
    }

    function displayPart(partnumber, manufacturer, lines = null) {
        if (lines === null) {
            lines = [];
            for (const [key, value] of Object.entries(manufacturer.data[partnumber])) {
                if (value === '(Empty)' || value === null) continue;
                lines.push(`<b>${key}:</b> ${value}`);
            }
        }

        var title = `<div class="infoTitle">${manufacturer.manufacturer} ${partnumber}</div>`;
        lines = [`<div>${lines.join("<br>")}</div>`];
        switch(manufacturer.manufacturer) {
            case 'samsung': lines.push(_SamsungRAM_info); break;
            case 'micron': lines.push(_Micron_info); break;
            case 'skhynix': lines.push(_SKHynix_info); break;
            case 'kioxia': lines.push(_Kioxia_info); break;
            case 'amd': lines.push(_AMD_info); break;
        }
        switch(manufacturer.type) {
            case 'ddr4': lines.push(_DDR4_info); break;
            case 'mcp': lines.push(_MCP_info); break;
            case 'ufs': lines.push(_UFS_info); break;
            case 'emmc': lines.push(_eMMC_info); break;
            case 'lpddr4': null;
            case 'lpddr4x': null;
            case 'lpdram': lines.push(_LPDDR_info); break;
            case 'mlc_nand': null;
            case 'slc_nand': null;
            case 'tlc_nand': null;
            case '3d_nand': lines.push(_NAND_info); break;
        }

        document.getElementById("results").innerHTML = title.concat(lines.join("<br>"));
        document.getElementById("decoders").style.display = "none";
        document.getElementById("results").style.display = "block";
        document.getElementById("other_results_container").style.display = "block";

    }

    return {
        startSearch
    }
});



// Initialize Search___________________________________________________________
var Search;
(async () => {
    Search = await SearchModule();
})();


// Callback for search button
function submitText(event) {
    var text = document.getElementById("searchbar").value;
    Search.startSearch(text);
}