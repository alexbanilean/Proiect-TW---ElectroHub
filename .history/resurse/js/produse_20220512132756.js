// window.addEventListener("DOMContentLoaded", function(){


//     var btn=document.getElementById("filtrare");
//     btn.onclick=function(){
//         var articole=document.getElementsByClassName("produs");
//         for(let art of articole){

//             art.style.display="none";

//             /*
//             v=art.getElementsByClassName("nume")
//             nume=v[0]*/
//             var nume=art.getElementsByClassName("val-nume")[0];//<span class="val-nume">aa</span>
//             console.log(nume.innerHTML)
//             var conditie1=nume.innerHTML.startsWith(document.getElementById("inp-nume").value)

//             var pret=art.getElementsByClassName("val-pret")[0]
//             var conditie2=parseInt(pret.innerHTML) > parseInt(document.getElementById("inp-pret").value);

//             var radbtns=document.getElementsByName("gr_rad");
//             for (let rad of radbtns){
//                 if (rad.checked){
//                     var valCalorii=rad.value;//poate fi 1, 2 sau 3
//                     break;
//                 }
//             }

//             var caloriiArt= parseInt(art.getElementsByClassName("val-calorii")[0].innerHTML);
//             var conditie3=false;
//             switch (valCalorii){
//                 case "1": conditie3= (caloriiArt<350); break;
//                 case "2": conditie3= (caloriiArt>=350 && caloriiArt<700); break;
//                 case "3": conditie3= (caloriiArt>=700); break;
//                 default: conditie3=true;

//             }
//             console.log(conditie3);

//             var selCateg=document.getElementById("inp-categorie");
//             var conditie4= (art.getElementsByClassName("val-categorie")[0].innerHTML == selCateg.value ||  selCateg.value=="toate");


//             if(conditie1 && conditie2 && conditie3 && conditie4)
//                 art.style.display="block";
        
//         }
//     }
//     var rng=document.getElementById("inp-pret");
//     rng.onchange=function(){
//         var info = document.getElementById("infoRange");//returneaza null daca nu gaseste elementul
//         if(!info){
//             info=document.createElement("span");
//             info.id="infoRange"
//             this.parentNode.appendChild(info);
//         }
    
//         info.innerHTML="("+this.value+")";
//     }



//     function sorteaza(semn){
//         var articole=document.getElementsByClassName("produs");
//         var v_articole=Array.from(articole);
//         v_articole.sort(function(a,b){
//             var nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
//             var nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
//             if(nume_a!=nume_b){
//                 return semn*nume_a.localeCompare(nume_b);
//             }
//             else{
            
//                 var pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML);
//                 var pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML);
//                 return semn*(pret_a-pret_b);
//             }
//         });
//         for(let art of v_articole){
//             art.parentNode.appendChild(art);
//         }
//     }

//     var btn2=document.getElementById("sortCrescNume");
//     btn2.onclick=function(){
    
//         sorteaza(1)
//     }

//     var btn3=document.getElementById("sortDescrescNume");
//     btn3.onclick=function(){
//         sorteaza(-1)
//     }


//     document.getElementById("resetare").onclick=function(){
//         //resetare inputuri
//         document.getElementById("i_rad4").checked=true;
//         document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
//         document.getElementById("infoRange").innerHTML="("+document.getElementById("inp-pret").min+")";

//         //de completat...


//         //resetare articole
//         var articole=document.getElementsByClassName("produs");
//         for(let art of articole){

//             art.style.display="block";
//         }
//     }

//     // -------------------- selectare produse cos virtual----------------------------------
//     /*
//         indicatie pentru cand avem cantitati
//         fara cantitati: "1,2,3,4" //1,2,3,4 sunt id-uri
//         cu cantitati:"1:5,2:3,3:1,4:1" // 5 produse de tipul 1, 3 produse de tipul 2, 1 produs de tipul 3...
//         putem memora: [[1,5],[2,3],[3,1],[4,1]]// un element: [id, cantitate]

//     */
//     ids_produse_init=localStorage.getItem("produse_selectate");
//     if(ids_produse_init)
//         ids_produse_init=ids_produse_init.split(",");//obtin vectorul de id-uri ale produselor selectate  (din cosul virtual)
//     else
//         ids_produse_init=[]

//     var checkboxuri_cos = document.getElementsByClassName("select-cos");
//     for (let ch of checkboxuri_cos){
//         if (ids_produse_init.indexOf(ch.value)!=-1)
//             ch.checked=true;
//         ch.onchange=function(){
//             ids_produse=localStorage.getItem("produse_selectate")
//             if(ids_produse)
//                 ids_produse=ids_produse.split(",");
//             else
//                 ids_produse=[]
//             console.log("Selectie veche:", ids_produse);
//             //ids_produse.map(function(elem){return parseInt(elem)});
//             //console.log(ids_produse);
//             if(ch.checked){
//                 ids_produse.push(ch.value);//adaug elementele noi, selectate (bifate)
//             }
//             else{
//                 ids_produse.splice(ids_produse.indexOf(ch.value), 1) //sterg elemente debifate
//             }
//             console.log("Selectie noua:",ids_produse);
//             localStorage.setItem("produse_selectate",ids_produse.join(","))
//         }
//     }
//  });


//  window.onkeydown=function(e){
//     console.log(e);
//     if(e.key=="c" && e.altKey==true){
//         var suma=0;
//         var articole=document.getElementsByClassName("produs");
//         for(let art of articole){
//             if(art.style.display!="none")
//                 suma+=parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
//         }

//         var spanSuma;
//         spanSuma=document.getElementById("numar-suma");
//         if(!spanSuma){
//             spanSuma=document.createElement("span");
//             spanSuma.innerHTML=" Suma:"+suma;//<span> Suma:...
//             spanSuma.id="numar-suma";//<span id="..."
//             document.getElementById("p-suma").appendChild(spanSuma);
//             setTimeout(function(){document.getElementById("numar-suma").remove()}, 1500);
//         }
//     }


//  }

window.addEventListener("load", function(){
    document.getElementById("inp-pret-min").onchange = function(){
        document.getElementById("infoRangeMin").innerHTML = "(" + this.value + ")";
    }

    document.getElementById("inp-pret-max").onchange = function(){
        document.getElementById("infoRangeMax").innerHTML = "(" + this.value + ")";
    }

    document.getElementById("inp-premium").onchange = function(){
        document.getElementById("inp-any-type").checked = !this.value;
    }

    document.getElementById("inp-any-type").onchange = function(){
        document.getElementById("inp-premium").checked = !this.value;
    }

    document.getElementById("filtrare").onclick = function(){

        var valNume = document.getElementById("inp-nume").value.toLowerCase();

        var butoaneRadio = document.getElementsByName("gr_rad");

        for(let rad of butoaneRadio){
            if(rad.checked){
                var valGreutate = rad.value;
                break;
            }
        } 

        var minGreutate, maxGreutate;

        if(valGreutate != "toate"){
            
            [minGreutate, maxGreutate] = valGreutate.split(":");
            
            minGreutate = parseInt(minGreutate);
            maxGreutate = parseInt(maxGreutate);
        }
        else{
            minGreutate = 0;
            maxGreutate = 10000000;
        }

        var valPretMin = parseInt(document.getElementById("inp-pret-min").value);
        var valPretMax = parseInt(document.getElementById("inp-pret-max").value);

        var valCategorie = document.getElementById("inp-categorie").value;
        var articole = document.getElementsByClassName("produs");
        var premium = document.getElementById("inp-premium").checked;
        var any_type = document.getElementById("inp-any-type").checked;

        // if(premium && any_type)
        //     document.getElementById("inp-premium").checked = false;

        for(let art of articole){
            art.style.display = "none";
            
            let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1 = false;

            if(valNume.includes('*')){
                const v_valNume = valNume.split("*");

                if(v_valNume.length == 2)
                    cond1 = numeArt.startsWith(v_valNume[0]) && numeArt.endsWith(v_valNume[1]);
                else
                    cond1 = false;
            }
            else
                cond1 = numeArt.startsWith(valNume);
            

            let pretArt = parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            let cond2 = (valPretMin <= pretArt && pretArt <= valPretMax);

            let categorieArt = art.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond3 = (valCategorie == "toate" || valCategorie == categorieArt);

            let premiumArt = (art.getElementsByClassName("val-premium")[0].innerHTML.includes("Da"));
            let cond4 = (premium == premiumArt || any_type);

            let greutateArt = parseInt(art.getElementsByClassName("val-greutate")[0].innerHTML);
            let cond5 = (minGreutate <= greutateArt && greutateArt <= maxGreutate);

            let conditieFinala = (cond1 && cond2 && cond3 && cond4 && cond5);

            if(conditieFinala){
                art.style.display = "block";
            }

        }
        
    }

    document.getElementById("resetare").onclick=function(){
        var articole = document.getElementsByClassName("produs");
        for(let art of articole){
            art.style.display = "block";
        }

        document.getElementById("inp-nume").value = "";
        document.getElementById("i_rad4").checked = true;
        document.getElementById("inp-pret-min").value = 0;
        document.getElementById("inp-pret-max").value = 5000;
        document.getElementById("sel-toate").selected = true;
        document.getElementById("infoRangeMin").innerHTML = "";
        document.getElementById("infoRangeMax").innerHTML = "";
        document.getElementById("inp-any-type").checked = true;
    }

    function sorteaza(semn){
        var articole = document.getElementsByClassName("produs");
        var v_articole = Array.from(articole);

        v_articole.sort(function(a, b){
            var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a != pret_b)
                return semn * (pret_a - pret_b);
            else{
                var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn * nume_a.localeCompare(nume_b);
                }
                
        });

        for(let art of v_articole){
            art.parentElement.appendChild(art);
        }
    }

    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
        }

    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }

    document.getElementById("p-suma").onclick=function(){
        var p_vechi = document.getElementById("suma");
        if(!p_vechi){
            suma = 0;
            var articole = document.getElementsByClassName("produs");
            for(let art of articole){
                if(art.style.display != "none"){
                suma += parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML); 
                } 
            }

            var pgf = document.createElement("p");  
            pgf.innerHTML="<b>Suma: </b>" + suma + "  RON";
            pgf.id="suma";
            var sectiune = document.getElementById("produse");
            sectiune.parentNode.insertBefore(pgf, sectiune);

            setTimeout(function(){
                var p_vechi = document.getElementById("suma");
                if(p_vechi)
                    p_vechi.remove();
            }, 2000);
        }
    }

    var checkboxes = this.document.getElementsByClassName("select-cos");
    
    for(let ch of checkboxes){

        // daca ch e cu let e locala si merge asa, daca e cu var nu merge pt ca ia doar ultimul checkbox in considerare

        ch.onchange = function(){
            if(this.checked){
                idsProduse = localStorage.getItem("cos_virtual");
                if(idsProduse){
                    idsProduse = idsProduse.split(",");
                }
                else{
                    idsProduse = [];
                }

                idsProduse.add();
            }
        }
    }

})

