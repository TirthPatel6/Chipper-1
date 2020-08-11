var parts = document.getElementsByClassName("part")
var activepart = null;

for (var p of parts) {
    var chunks = p.getElementsByTagName('data');
    var intervals = [50, 60, 75, 85, 75, 60];
    var i = 0;
    for (x of chunks) {
        x.style.backgroundColor = "hsl(348, 55%, " + intervals[i % intervals.length] + "%)";
        x.style.transition = "0.2s";
        x.onclick = ((num, part) => ((event) => button(event, num, part)))(i, p);
        i++;
    }
}

function button(event, num, part) {
    // Declare all variables
    var i, oldtabcontent, tabcontent, oldtablinks;

    if (activepart !== null) {
        // Get all elements with class="tabcontent" and hide them
        oldtabcontent = activepart.getElementsByClassName("partContent")[0].getElementsByTagName("div");
        for (i = 0; i < oldtabcontent.length; i++) {
            oldtabcontent[i].style.display = "none";
        }
        // Get all elements with class="tablinks" and remove the class "active"
        oldtablinks = activepart.getElementsByTagName('data');
        for (i = 0; i < oldtablinks.length; i++) {
            oldtablinks[i].className = oldtablinks[i].className.replace(" active", "");
        }
    }
    
    // Update active part
    activepart = part;
    tabcontent = activepart.getElementsByClassName("partContent")[0].getElementsByTagName("div");

    // Show the current tab, and add an "active" class to the button that opened the tab
    tabcontent[num].style.display = "block";
    event.currentTarget.className += " active";
}