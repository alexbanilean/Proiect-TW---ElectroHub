const express= require("express");
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

app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                res.render("pagini/404");
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

app.listen(8080);
console.log("Am pornit!");