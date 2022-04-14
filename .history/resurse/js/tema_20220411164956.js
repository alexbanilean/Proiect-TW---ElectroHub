window.onload=function(){

    var tema=localStorage.getItem("tema");

    document.getElementById("btn_tema").onclick=function(){
        document.body.classList.toggle("dark");
    }
}