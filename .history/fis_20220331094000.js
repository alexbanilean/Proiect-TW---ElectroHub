// a = 10;
// alert(window.a);
// var raspuns = prompt("Expresie matematica?", "de exemplu 1 + 2");
// alert(eval(raspuns));
// var ras = confirm("Iti place pagina?");
// alert(raspuns ? "da" : "nu");

window.onload = function(){
    var p = document.getElementById("p1");
    p.title = "descriere";
    // alert(1);
    p.style.border = "1px solid blue";
    p.style.backgroundColor = "pink";
    
    var b_ok = document.getElementById("btn");
    b_ok.onclick = function(){
        var inp = document.getElementById("inp");
        p.innerHTML += inp.value;
    }

    var b_filtru = document.getElementById("filtreaza");
    b_filtru.onclick = function(){
        var paragrafe = document.getElementsByClassName("a");
        for(let pgf of paragrafe){
            pgf.style.display = "none";
            if(pgf.innerHTML.includes(document.getElementById("inp").value))
                pgf.style.display = "block";
        }
    }

    var b_create = document.getElementById("creeaza");
    b_create.onclick = function(){
        var p = document.createElement("p");
        p.innerHTML()
    }
    
}

// alert(2);