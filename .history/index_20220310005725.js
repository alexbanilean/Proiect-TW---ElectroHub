const express= require("express");
const { redirect } = require("express/lib/response");
app= express();

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"))

app.get(["/", "/index", "home"}, function(req, res){
    console.log(__dirname);
    res.render("pagini/index");
})

app.get("/despre", function(req, res){
    console.log(__dirname);
    res.render("pagini/despre");
})

app.get("/ceva", function(req, res, next){
    res.write("<p style='color:pink'>Salut-1</p>");
    console.log("1");
    next()
    // res.end();
})

app.get("/ceva", function(req, res, next){
    res.write("Salut-2");
    console.log("2");
})

app.get("/*", function(req, res){
    res.write("Cerere generala");
    console.log("generala");
    res.end();
})



app.listen(8080);
console.log("Am pornit!");