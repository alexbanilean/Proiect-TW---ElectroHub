function setCookie(nume, val, timpExp, path = "/"){
    // timpExp = timp in ms in care va expira cookie-ul
    d = new Date();
    d.setTime(d.getTime() + timpExp);

    console.log("Va expira:", d.toUTCString());

    document.cookie = `${nume} = ${val}; expires = ${d.toUTCString()}; path = ${path}`;

}

function getCookie(nume){
    var vectCookies = document.cookie.split(";");
    for(let c of vectCookies){
        c = c.trim();
        if(c.startsWith(nume + " =")){
            return c.substring(indexOf("=") + 2);
        }
            
    }

}

function deleteCookie(nume){
    setCookie(nume, "", 0);
}

// functie care verifica ca exista cookie-ul "acceptat_banner" caz in care ascundem bannerul
// altfel, daca nu exista cookie-ul, afisam bannerul si setam o functie la click prin care adaugam cookie-ul(care va expira dupa 5s)

function checkBanner(){
    if(getCookie("acceptat_banner")){
        document.getElementById("banner").style.display = "none";
    }
    else{
        document.getElementById("banner").style.display = "block";
        document.getElementById("ok_cookies").onclick = function(){
            document.getElementById("banner").style.display = "none";
            setCookie("acceptat_banner", "", 5 * 1000);
        }
    }
}