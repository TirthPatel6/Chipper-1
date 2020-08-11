function toDecoder() {
    document.getElementsByClassName("current_page_item")[0].classList.remove("current_page_item");
    document.getElementById("_menu_Decoder").classList.add("current_page_item");
    document.getElementById("welcome").style.display = "none";
    document.getElementById("contactblob").style.display = "none";
    document.getElementById("searchTitle").style.display = "none";
    document.getElementById("decoderTitle").style.display = "block";
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("decoders").style.display = "block";
}

function toSearch() {
    document.getElementsByClassName("current_page_item")[0].classList.remove("current_page_item");
    document.getElementById("_menu_Search").classList.add("current_page_item");
    document.getElementById("welcome").style.display = "none";
    document.getElementById("contactblob").style.display = "none";
    document.getElementById("decoderTitle").style.display = "none";
    document.getElementById("searchTitle").style.display = "block";
    document.getElementById("decoders").style.display = "none";
    document.getElementById("searchContainer").style.display = "flex";
}

function toAbout() {
    document.getElementsByClassName("current_page_item")[0].classList.remove("current_page_item");
    document.getElementById("_menu_About").classList.add("current_page_item");
    document.getElementById("welcome").style.display = "block";
    document.getElementById("contactblob").style.display = "none";
    document.getElementById("searchTitle").style.display = "none";
    document.getElementById("decoderTitle").style.display = "none";
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("decoders").style.display = "none";
}

function toContact() {
    document.getElementsByClassName("current_page_item")[0].classList.remove("current_page_item");
    document.getElementById("_menu_Contact").classList.add("current_page_item");
    document.getElementById("welcome").style.display = "none";
    document.getElementById("contactblob").style.display = "block";
    document.getElementById("searchTitle").style.display = "none";
    document.getElementById("decoderTitle").style.display = "none";
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("decoders").style.display = "none";
}