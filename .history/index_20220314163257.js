const express= require("express");
const fs = require("fs");
// const { redirect, sendFile } = require("express/lib/response");
app= express();

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"))

app.get(["/", "/index", "/home"], function(req, res){
    console.log(__dirname);
    res.render("pagini/index", {ip: req.ip});
})

// app.get("/despre", function(req, res){
//     console.log(__dirname);
//     res.render("pagini/despre");
// })

app.get("/*.ejs", function(req, res){
    res.status(403).render("pagini/403");
    console.clear();
})

app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                res.status(404).render("pagini/404");
            }
            else{
                res.render("pagini/eroare_generala");
            }
        }
        else{
            console.log(rezRender);
            res.send(rezRender);
        }
    });
    console.log("Cerere generala:", req.url);

    res.end();
})



function creeazaImagini(){
    var buf = fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");

    obImagini = JSON.parse(buf); //global

    //console.log(obImagini);

    for (let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie] = imag.fisier.split("."); // "abc.de".split(".") ---> ["abc","de"]
        
        let dim_mediu = 250;

        imag.mediu = `${obImagni.cale_galerie}/mediu/${nume_imag}-`;

        let dim_mic = 150;
        
        imag.mic = `${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp`; //nume-150.webp // "a10" b=10 "a"+b `a${b}`

        //console.log(imag.mic);

        imag.mare = `${obImagini.cale_galerie}/${imag.fisier}`;
        
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);

        
    }

}

creeazaImagini();



app.listen(8080);
console.log("Am pornit!");