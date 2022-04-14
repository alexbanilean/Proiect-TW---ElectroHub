const express= require("express");
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const { append } = require("express/lib/response");
// const {SourceMap} = require("module");

// const { password, database } = require("pg/lib/defaults");

var client = new Client({user:"alex_test", password: "alex_test", database: "BD_ElectroHub", host: "localhost", port: 5432});

// const { redirect, sendFile } = require("express/lib/response");

client.connect();

const obGlobal={obImagini:null, obErori:null};

app= express();

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"))

// app.use("/*", function(req, res, next){
//     res.locals.proprGenerala="Ceva care se afiseaza pe toate paginile";
//     next();
// })

app.get(["/", "/index", "/home"], function(req, res){
    console.log(__dirname);
    client.query("select * from tabel_test", function(err, rezQuery){
        // console.log(rezQuery)
        if(!err)
            res.render("pagini/index", {ip: req.ip, imagini: obImagini.imagini, produse: rezQuery.rows});
        else
            console.log("eroare!");
    })
})

app.get("/produse", function(req, res){
    client.query("select * from unnest(enum_range(null::categorie_produs))", function(err, rezCateg){

        var cond_where=req.query.tip ? `tip_produse='${req.query.tip}'` : "1=1";

        client.query("select * from produse", function(err, rezQuery){
            console.log(rezQuery);
            if(!err)
                res.render("pagini/produse", {produse: rezQuery.rows, optiuni : rezCateg.rows});
        });

        console.log(rezCateg);
    })
})

app.get("/produs/:id", function(req, res){
    client.query(`select * from produse where id=${req.params.id}`, function(err, rezQuery){
        console.log(rezQuery);
        if(!err)
            res.render("pagini/produs", {prod: rezQuery.rows[0]});
    });
})

app.get("/eroare", function(req, res){
    randeazaEroare(res, 1, "Titlu schimbat");
})

app.get("*/galerie-animata.css", function(req,res){
    var sirScss = fs.readFileSync(__dirname+"/resurse/scss/galerie_animata.scss").toString("utf8");
    // var culori = ["navy", "black", "purple", "grey"];
    // var culoare_aleatoare = culori[Math.floor(Math.random() * culori.length)];
    var numar_imagini_aleator = 6 + Math.floor(Math.random() * 7);
    let nrimg = numar_imagini_aleator, id = 1;
    const lista_imagini_galerie_animata = [];
    while(nrimg > 0){
        
        if(id <= obImagini.imagini.length){
            lista_imagini_galerie_animata.push(obImagini.imagini[id - 1]);
        }

        id = id + 2;
        
        nrimg = nrimg - 1;
    }

    console.log(numar_imagini_aleator);
    console.log(lista_imagini_galerie_animata);

    rezScss = ejs.render(sirScss, {numar_imagini_aleator : numar_imagini_aleator, lista_imagini : lista_imagini_galerie_animata});
    // console.log(rezScss);
    var caleScss = __dirname + "/temp/galerie-animata.scss";
    fs.writeFileSync(caleScss,  rezScss);
    try {

        rezCompilare = sass.compile(caleScss, {SourceMap:true});

        var caleCss = __dirname + "/temp/galerie-animata.css";
        fs.writeFileSync(caleCss, rezCompilare.css);
        res.setHeader("Content-Type", "text/css");
        res.sendFile(caleCss);

    }
    catch (err){
        console.log(err);
        res.send("Eroare");
    }
})

app.get("/galerie-statica", function(req,res){
    res.render("pagini/galerie-statica", {imagini: obImagini.imagini});
})

// app.get("/despre", function(req, res){}
//     console.log(__dirname);
//     res.render("pagini/despre");
// })

app.get("/*.ejs", function(req, res){
    // res.status(403).render("pagini/403");
    randeazaEroare(res, 403);
    console.clear();
})

app.get("/*", function(req, res){
    // console.log(req.url);
    res.render("pagini" + req.url, function(err, rezRender){
        
        if(err){
            console.log(err);
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                // res.status(404).render("pagini/404");
                randeazaEroare(res, 404);
            }
            else{
                res.render("pagini/eroare_generala");
            }
        }
        else{
            // console.log(rezRender);
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
        [nume_imag, extensie] = imag.cale_imagine.split("."); // "abc.de".split(".") ---> ["abc","de"]
        
        let dim_mediu = 300;

        imag.mediu = `${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png`;

        let dim_mic = 150;
        
        imag.mic = `${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp`; //nume-150.webp // "a10" b=10 "a"+b `a${b}`

        //console.log(imag.mic);

        imag.mare = `${obImagini.cale_galerie}/${imag.cale_imagine}`;
        
        if(!fs.existsSync(imag.mediu))
            sharp(__dirname+"/"+imag.mare).resize(dim_mediu).toFile(__dirname+"/"+imag.mediu);

        if(!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);

    }

}

creeazaImagini();

function creeazaErori(){
    var buf = fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");

    obErori = JSON.parse(buf); //global
}

creeazaErori();

function randeazaEroare(res, identificator, titlu, text, imagine){
    var eroare = obErori.erori.find(function(elem){return elem.identificator == identificator;});
    titlu = titlu || (eroare && eroare.titlu) || "Titlu custom eroare";
    text = text || (eroare && eroare.text) || "Text custom eroare";
    imagine = imagine || (eroare && (obErori.cale_baza + "/" + eroare.imagine)) || "resurse/imagini/erori/interzis.png";
    if (eroare && eroare.status)
        res.status(eroare.identificator);
    res.render("pagini/eroare_generala", {titlu: titlu, text: text, imagine: imagine});
}

app.listen(8080);
console.log("A pornit!");