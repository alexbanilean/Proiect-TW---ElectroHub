window.addEventListener("load",function(){

	/*
	TO DO: preluare vector id-uri din localStorage

	*/

	idsProduse = localStorage.getItem("cos_virtual");
    
    if(idsProduse){
        idsProduse = idsProduse.split(",");
    }
    else{
        idsProduse = [];
    }

    for(let id_prod of idsProduse){
        var ch = document.querySelector(`[value='${id_prod}'].select-cos`);
        if(ch){
            ch.checked = true;
        }
    }


	if (/* avem produse?*/){
		var vect_ids=prod_sel.split(",");
		fetch("/produse_cos", {		

			method: "POST",
			headers:{'Content-Type': 'application/json'},
			
			mode: 'cors',		
			cache: 'default',
			body: JSON.stringify({
				ids_prod: /* ??? */

			})
		})
		.then(function(rasp){ console.log(rasp); x=rasp.json(); console.log(x); return x})
		.then(function(objson) {
	
			console.log(objson);
			for (let prod of objson){
				/* TO DO 
				pentru fiecare produs, creăm un articol in care afisam imaginea si cateva date precum:
				- nume, pret, imagine, si alte caracteristici

				
				document.getElementsByTagName("main")[0].insertBefore(divCos, document.getElementById("cumpara"));
				*/
			}
	
		}
		).catch(function(err){console.log(err)});



/*
		document.getElementById("cumpara").onclick=function(){
				//TO DO: preluare vector id-uri din localStorage

			fetch("/cumpara", {		
	
				method: "POST",
				headers:{'Content-Type': 'application/json'},
				
				mode: 'cors',		
				cache: 'default',
				body: JSON.stringify({
					ids_prod: 0,
				})
			})
			.then(function(rasp){ console.log(rasp); return rasp.text()})
			.then(function(raspunsText) {
		   
				console.log(raspunsText);
				//Ștergem conținutul paginii
				//creăm un paragraf în care scriem răspunsul de la server
				//Dacă utilizatorul e logat și cumpărarea a reușit, 
				
				let p=document.createElement("p");
				p.innerHTML=raspunsText;
				document.getElementsByTagName("main")[0].innerHTML="";
				document.getElementsByTagName("main")[0].appendChild(p)
				if(!raspunsText.includes("nu sunteti logat"))
					localStorage.removeItem("produse_selectate");
		   
			}
			).catch(function(err){console.log(err)});
		}
		*/
	}
	else{
		document.getElementsByTagName("main")[0].innerHTML="<p>Nu aveti nimic in cos!</p>";
	}
	
	
});