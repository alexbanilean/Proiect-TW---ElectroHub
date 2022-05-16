function setCookie(nume, val, timpExp, path="/"){
    // timpExp = timp in ms in care va expira cookie-ul
    d = new Date();
    d.setTiem(d.getTime() + timpExp);

    console.log("Va expira:", d.toUTCString());

    document.cookie = `${nume} = ${val}; expires = ${d.toUTCString()}; path = ${path}`;

}

function getCookie(nume){
    var vectCookies = document.cookie.split(";");
    for(let c of vectCookies){
        c = c.trim()
    }

}