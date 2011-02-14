var express = require("express")
  , i18n = require("../lib/i18n");

var app = express.createServer(
  express.i18n(__dirname,"en")
)

app.set("views",__dirname)

app.get("/*",function(req,res,next){
  if( req.query && req.query.lang )
    app.set("i18n lang",req.query.lang)
  next()
})

app.get("/1",function(req,res,next){
  res.send("This is just a plain string")
})

app.get("/2",function(req,res,next){
  res.send("This is just a plain string from the i18n instance:" + req.i18n.t("embedded"))
})

app.get("/3",function(req,res,next){
  res.render("index.ejs", {layout:false})
})


app.listen(1234)