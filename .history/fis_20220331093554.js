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

    var b_filter = document.getElementById("filtreaza");
    b_filter.onclick = function(){
        var paragrafe = document.getElementsByClassName("a");
        for(let pgf of paragrafe){
            
            pgf.style.display
            
            if(pgf.innerHTML.includes(document.getElementById("inp").value))

        }
    }
}

// alert(2);