const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const { append } = require("express/lib/response");
const formidable = require("formidable");
const crypto = require("crypto");
const session = require("express-session");
const {SourceMap} = require("module");
const nodemailer = require("nodemailer");

// const { password, database } = require("pg/lib/defaults");

var client = new Client({user:"alex_test", password: "alex_test", database: "BD_ElectroHub", host: "localhost", port: 5432});

const { redirect, sendFile } = require("express/lib/response");
const { query } = require("express");

if(process.env.site_online){
    var client = new Client({
        user:"qshknnjtswnyih", 
        password: "24c3ed91e187ca8a36e82b84bbfe8fd3b45aea38d7b639987e50615580207d89", 
        database: "db0cf2v940gb07", 
        host: "ec2-34-197-84-74.compute-1.amazonaws.com", 
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else{
    
}

client.connect();

const obGlobal={obImagini:null, obErori:null};
var obImaginiGalerieAnimata = new Array, numar_imagini_aleator = 0;

app = express();

app.use(session({ //aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"))

app.use("/*", function(req, res, next){
    res.locals.proprGenerala="Ceva care se afiseaza pe toate paginile";
    res.locals.utilizator = req.session.utilizator;
    next();
})

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
    rezScss = ejs.render(sirScss, {numar_imagini_aleator : numar_imagini_aleator});

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

app.get("*/galerie-animata.css.map",function(req, res){
    res.sendFile(path.join(__dirname, "temp/galerie-animata.css.map"));
});

app.get("*/galerie-animata", function(req,res){

    res.render("pagini/galerie-animata", {imagini: obImaginiGalerieAnimata, numar_imagini_aleator : numar_imagini_aleator});
});

app.get("*/galerie-statica", function(req,res){
    res.render("pagini/galerie-statica", {imagini: obImagini.imagini});
});

// app.get("/despre", function(req, res){}
//     console.log(__dirname);
//     res.render("pagini/despre");
// })

// -------------------- utilizatori ----------------------
parolaServer = "tehniciweb";

app.post("/inreg", function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(campuriText);

        var eroare = "";
        
        if(campuriText.username == ""){
            eroare += "Username necompletat. ";
        }
        
        if(!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))){
            eroare += "Username nu corespunde patternului. ";
        }

        if(!eroare){
            queryUtiliz = `select username from utilizatori where username = '${campuriText.username}'`;
            client.query(queryUtiliz, function(err, rezUtiliz){
                if(rezUtiliz.rows.length != 0){
                    eroare += "Username-ul mai exsita. ";
                }
                else{
                    var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
                    var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat) values 
                                            ('${campuriText.username}', '${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}')`;
                    client.query(comandaInserare, function(err, rezInserare){
                        if(err){
                            console.log(err);
                            res.render("pagini/inregistrare", {err: "Eroare baza de date."});
                        }
                        else{
                            res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse."});
                        }
                    })   
                }
            })
        }
        else{
            res.render("pagini/inregistrare", {err: eroare});
        }
    });
})

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{
            //date login             
            user:obGlobal.emailServer,
            pass:"rwgmgkldxnarxrgu"
         },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html   
    await transp.sendMail({
          from:obGlobal.emailServer,
           to:email,
           subject:subiect,
           //"Te-ai inregistrat cu succes",       
            text:mesajText, //"Username-ul tau este "+username      
            html: mesajHtml,
            // `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,        attachments: atasamente    
    })
    
    console.log("trimis mail");
}



app.post("/login",function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(campuriText);
        var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
        var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}'`;
        client.query(querySelect, function(err, rezSelect){
            if(err)
                console.log(err);
            else{
                if(rezSelect.rows.length == 1){ // Daca am utilizatorul si a dat crediteantiale corecte
                    req.session.utilizator = {
                        nume : rezSelect.rows[0].nume,
                        prenume : rezSelect.rows[0].prenume,
                        username : rezSelect.rows[0].username,
                        email : rezSelect.rows[0].email,
                        culoare_chat : rezSelect.rows[0].culoare_chat,
                        rol : rezSelect.rows[0].rol
                    }
                    res.redirect("/index");
                }
            }
        })
    })
});

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator = null;
    res.render("pagini/logout");
});

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

function numarImaginiAleator(){

    numar_imagini_aleator = 6 + Math.floor(Math.random() * 7);
    let nrimg = numar_imagini_aleator, id = 1;

    obImaginiGalerieAnimata = [];

    while(nrimg > 0){
        if(id < obImagini.imagini.length){
            obImaginiGalerieAnimata.push(obImagini.imagini[id]);
        }

        id = id + 2;
        if(id >= obImagini.imagini.length)
            id = 0;
        nrimg = nrimg - 1;
    }

    console.log(numar_imagini_aleator);
    console.log(obImaginiGalerieAnimata);
}

numarImaginiAleator();

var s_port = process.env.PORT || 8080;
app.listen(s_port);

// app.listen(8080);
console.log("A pornit!");