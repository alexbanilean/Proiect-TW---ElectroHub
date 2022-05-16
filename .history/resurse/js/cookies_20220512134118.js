function setCookie(nume, val, timpExp, path = "/"){
    // timpExp = timp in ms in care va expira cookie-ul
    d = new Date();
    d.setTime(d.getTime() + timpExp);

    console.log("Va expira:", d.toUTCString());

    document.cookie = `${nume}=${val}; expires=${d.toUTCString()}; path=${path}`;

}

function getCookie(nume){
    var vectCookies = document.cookie.split(";");
    for(let c of vectCookies){
        c = c.trim();
        if(c.startsWith(nume + "=")){
            return c.substring(c.indexOf("=") + 1);
        }
            
    }

}

function deleteCookie(nume){
    setCookie(nume, "", 0);
}

function deleteAllCookies(){
    var vectCookies = document.cookie.split(";");
    for(let c of vectCookies){
        c = c.trim();
        deleteCookie(c.substring(0, c.indexOf("=") - 1));
    }
}

// functie care verifica ca exista cookie-ul "acceptat_banner" caz in care ascundem bannerul
// altfel, daca nu exista cookie-ul, afisam bannerul si setam o functie la click prin care adaugam cookie-ul (care va expira dupa 5s)

function checkBanner(){
    if(getCookie("acceptat_banner_cookie")){
        document.getElementById("banner_cookie").style.display = "none";
    }
    else{
        document.getElementById("banner_cookie").style.display = "block";
        document.getElementById("ok_cookies").onclick = function(){
            document.getElementById("banner_cookie").style.display = "none";
            setCookie("acceptat_banner_cookie", "", 5 * 1000);
        }
    }
}

window.addEventListener("DOMContentLoaded", function(){
    checkBanner();
});