window.onload=function(){
    var tema=localStorage.getItem("tema");
    if(tema)
        document.body.classList

    document.getElementById("btn_tema").onclick=function(){
        document.body.classList.toggle("dark");
    }
}