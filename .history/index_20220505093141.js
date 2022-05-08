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
const path = require("path");

// const { password, database } = require("pg/lib/defaults");

const { redirect, sendFile } = require("express/lib/response");
const { query } = require("express");
const { string } = require("sharp/lib/is");

const obGlobal = {
    obImagini:null, 
    obErori:null,
    emailServer: "clienti.electrohub@gmail.com",
    port: 8080,
    sirAlphaNum: "",
    protocol: null,
    numeDomeniu: null,
    categorii_meniu: null
};

v_intervale = [[48, 57], [65, 90], [97, 122]];

for(let interval of v_intervale){
    for(let i = interval[0]; i <= interval[1]; i++){
        obGlobal.sirAlphaNum += String.fromCharCode(i);
    }
}

function genereazaToken(n){
    let token = "";

    for(let i = 0; i < n; i++){
        token += obGlobal.sirAlphaNum[Math.floor(Math.random() * obGlobal.sirAlphaNum.length)];
    }

    return token;
}


function getIp(req){ //pentru Heroku
    var ip = req.headers["x-forwarded-for"];//ip-ul userului pentru care este forwardat mesajul
    if (ip){
        let vect=ip.split(",");
        return vect[vect.length-1];
    }
    else if (req.ip){
        return req.ip;
    }
    else{
     return req.connection.remoteAddress;
    }
}



var obImaginiGalerieAnimata = new Array, numar_imagini_aleator = 0;

if(process.env.site_online){
    var client = new Client({
        user: "qshknnjtswnyih", 
        password: "24c3ed91e187ca8a36e82b84bbfe8fd3b45aea38d7b639987e50615580207d89", 
        database: "db0cf2v940gb07", 
        host: "ec2-34-197-84-74.compute-1.amazonaws.com", 
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    });

    obGlobal.protocol = "https://";
    obGlobal.numeDomeniu = "rocky-shore-43059.herokuapp.com";
}
else{
    var client = new Client({
        user:"alex_test", 
        password: "alex_test", 
        database: "BD_ElectroHub", 
        host: "localhost", 
        port: 5432});
        
    obGlobal.protocol = "http://";
    obGlobal.numeDomeniu = "localhost:8080";
}

client.connect();

// creare foldere necesare

foldere = ["temp", "poze_uploadate"];

for(let folder of foldere){
    
    let caleFolder = path.join(__dirname, folder);

    if(!fs.existsSync(caleFolder))
        fs.mkdirSync(caleFolder);
}

app = express();

client.query("select * from unnest(enum_range(null::categorie_produs))", function(err, rezCateg){
    if(!err){
        // console.log(rezCateg);
        obGlobal.categorii_meniu = rezCateg.rows;
        // console.log(res.locals.categorii_meniu);
    }
    else
        console.log("eroare meniu produse");
})

app.use(session({ //aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/poze_uploadate", express.static(__dirname + "/poze_uploadate"));

app.use("/*", function(req, res, next){
    res.locals.proprGenerala="Ceva care se afiseaza pe toate paginile";
    res.locals.utilizator = req.session.utilizator;
    res.locals.categorii_meniu = obGlobal.categorii_meniu;
    res.locals.mesajLogin = req.session.mesajLogin;
    // res.session.mesajLogin = null;

    next();
})

// ----------------- Accesari --------------------
app.get("/*", function(req, res, next){
    let queryInsert = `insert into accesari(ip, user_id, pagina) values ($1::text, $2, $3::text)`;

    client.query(queryInsert, [getIp(req), ], function(err, rezQuery){

    });

    next();
});

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

        var cond_where = req.query.tip ? `tip_produse='${req.query.tip}'` : "1=1";

        client.query("select * from produse", function(err, rezQuery){
            // console.log(rezQuery);
            if(!err)
                res.render("pagini/produse", {produse: rezQuery.rows, optiuni : rezCateg.rows});
        });

        // console.log(rezCateg);
    })
})

app.get("/produs/:id", function(req, res){
    client.query(`select * from produse where id=${req.params.id}`, function(err, rezQuery){
        // console.log(rezQuery);
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
        
        // console.log(campuriText);
        // console.log(campuriFisier);

        var username;
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
                    eroare += "Username-ul mai exista. ";
                    res.render("pagini/inregistrare", {err: "Eroare: " + eroare});
                }
                else{
                    var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
                    let token = genereazaToken(100);
                    var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod) values 
                                            ('${campuriText.username}', '${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token}')`;
                    client.query(comandaInserare, function(err, rezInserare){
                        if(err){
                            console.log(err);
                            res.render("pagini/inregistrare", {err: "Eroare baza de date."});
                        }
                        else{
                            res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse."});
                            let linkConfirmare = `${obGlobal.protocol}${obGlobal.numeDomeniu}/cod/${campuriText.username}/${token}`;
                            trimiteMail(campuriText.email, "Te-ai inregistrat!", "Text", `<p style='color:blue'>Username-ul tau este '${campuriText.username}'.</p>
                                        <a href=${linkConfirmare}>Link confirmare</a>`);
                        }
                    })   
                }
            })
        }
        else{
            res.render("pagini/inregistrare", {err: "Eroare: " + eroare});
        }

        formular.on("field", function(nume, val){
            // 1 - ordine de executare
            // orice camp de tip text, cand il primeste

            if(nume == "username")
                username = val;

        })

        formular.on("fileBegin", function(nume, fisier){
            // 2 - ordine de executare
            // cand incepe update / incarcarea 
           
            caleUtiliz = path.join(__dirname, "poze_uploadate", username);
            if(!fs.existsSync())
                fs.mkdirSync(caleUtiliz);

            fisier.filepath = path.join(caleUtiliz, fisier.originalFilename);

        })  

        formular.on("file", function(nume, fisier){
            // 3 - ordine de executare
            // cand s-a terminat incarcarea
        });
    
    });
})

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente = []){
    var transp = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{
            //date login             
            user: obGlobal.emailServer,
            pass: "gmnmeimjrbovqroi"
         },
        tls:{
            rejectUnauthorized: false
        }
    });

    //genereaza html   
    await transp.sendMail({
        from: obGlobal.emailServer,
        to: email,
        subject: subiect, // "Te-ai inregistrat cu succes",       
        text: mesajText, // "Username-ul tau este "+username      
        html: mesajHtml, // `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
        attachments: atasamente
    })
    
    console.log("trimis mail");
}

app.get("/cod/:username/:token", function(req, res){
    let current_date = new Date();
    let comandaGetData = `select data_adaugare from utilizatori where username = '${req.params.username}'`;
    let user_date = null;

    client.query(comandaGetData, function(err, rezData){
        if(err)
            console.log("err");
        else
            user_date = rezData;
    })

    if(current_date - user_date){
        var comandaUpdate = `update utilizatori set confirmat_mail = true where username = '${req.params.username}' and cod = '${req.params.token}'`;
        client.query(comandaUpdate, function(err, rezUpdate){
            if(err){
                console.log("err");
                randeazaEroare(res, 2);
            }
            else{
                if(rezUpdate.rowCount == 1){
                    res.render("pagini/confirmare");
                }
                else{
                    randeazaEroare(res, -1, "Mail neconfirmat", "Incercati din nou!");
                }
            }
        })
    }
    else{
        randeazaEroare(res, -1, "Timpul de confirmare a expirat", "Reinregistrare!");
    }
})

app.post("/login", function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(campuriText);
        var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
        // var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}' and confirmat_mail=true`;
        var querySelect = `select * from utilizatori where username = $1::text and parola = $2::text and confirmat_mail=true`;

        client.query(querySelect, [campuriText.username, parolaCriptata],function(err, rezSelect){
            if(err){
                console.log(err);
                randeazaEroare(res, 2);
            }
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
                else{
                    //randeazaEroare(res, -1, "Login esuat.", "User sau parola gresita sau mailul nu a fost confirmat", null);
                    req.session.mesajLogin = "Login esuat!";
                    res.redirect("/index")
                }
            }
        })
    })
});

//  ------------------------ Useri ----------------------------

app.get("/useri", function(req, res){
    if(req.session.utilizator && req.session.utilizator.rol == "admin"){
        client.query("select * from utilizatori", function(err, rezQuery){
            if(err)
                console.log(err);
            res.render("pagini/useri", {useri : rezQuery.rows});
        });
    }
    else{
        randeazaEroare(res, 403);
    }
});

app.post("/sterge_utiliz", function(req, res){
    
    var formular = new formidable.IncomingForm();
 
    formular.parse(req, function(err, campuriText, campuriFile){
        var queryDelete = `delete from utilizatori where id = '${campuriText.id_utiliz}'`;
        
        client.query(queryDelete, function(err, rezQuery){
            res.redirect("/useri");
        });
    });
});

// ----------------------- Update profil -----------------------------
 
app.post("/profil", function(req, res){
    
    console.log("profil");

    if (!req.session.utilizator){
        res.render("pagini/eroare_generala", {text: "Nu sunteti logat."});
        return;
    }
    
    var formular = new formidable.IncomingForm();
 
    formular.parse(req, function(err, campuriText, campuriFile){
       
        var criptareParola = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
 
        var queryUpdate = `update utilizatori 
                           set nume = '${campuriText.nume}', 
                               prenume = '${campuriText.prenume}', 
                               email = '${campuriText.email}',
                               culoare_chat = '${campuriText.culoare_chat}'
                           where parola = '${criptareParola}';`;

        client.query(queryUpdate, function(err, rez){
    
            if(err){
                console.log(err);
                res.render("pagini/eroare_generala", {text: "Eroare baza date. Incercati mai tarziu."});
                return;
            }

            console.log(rez.rowCount);

            if (rez.rowCount == 0){
                res.render("pagini/profil", {text: "Update-ul nu s-a realizat. Verificati parola introdusa."});
                return;
            }
            else{
                req.session.utilizator.nume = campuriText.nume;
                req.session.utilizator.prenume = campuriText.prenume;
                req.session.utilizator.email = campuriText.email;
                req.session.utilizator.culoare_chat = campuriText.culoare_chat;
            }
            
            res.render("pagini/profil", {text: "Update-ul s-a realizat cu succes."});
 
        });
       
    });
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

    // console.log(numar_imagini_aleator);
    // console.log(obImaginiGalerieAnimata);
}

numarImaginiAleator();

var s_port = process.env.PORT || 8080;
app.listen(s_port);

// app.listen(8080);
console.log("A pornit!");