function setCookie(nume, val, timpExp, path="/"){
    // timpExp = timp in ms in care va expira cookie-ul
    d = new Date();
    d.setTiem(d.getTime() + timpExp);

    console.log("Va expira:")
    
}