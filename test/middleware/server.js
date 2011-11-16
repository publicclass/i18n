var express = require("express")
  , assert = require("assert")
  , I18n = require("../../");

var app = express()
app.set("views",__dirname)

app.use(I18n.middleware("en",__dirname))

// A little middleware for changing locale based on a 'lang' query param.
app.use(function(req,res,next){
  if( req.query && req.query.lang )
    app.set("i18n lang",req.query.lang)
  next()
})

app.get("/1",function(req,res,next){
  res.send("This is just a plain string")
})

app.get("/2",function(req,res,next){
  res.send(req.i18n.t("embedded",req.i18n.locale))
})

app.get("/3",function(req,res,next){
  res.send(req.i18n.t("embedded",{i:{can:{haz:"BULA"}}}))
})

app.get("/4",function(req,res,next){
  res.render("index.ejs", {layout:false})
})

app.get("/5",function(req,res,next){
  res.render("index.jade")
})

app.get("/6",function(req,res,next){
  app.set("i18n path",__dirname+"/locale.js")
  res.send(req.i18n.t("embedded",{i:{can:{haz:"BULA"}}}))
})

var server = app.listen(process.env.PORT || 0)


module.exports = {
  'server is running': function(){
    assert.response(server,{method:'GET',url:'/1'},{status:200,body:'This is just a plain string'})
  },
  'with locale as context': function(){
    assert.response(server,{method:'GET',url:'/2'},{status:200,body:'With some localization from the locale file.'})
  },
  'with locale as context (fr from json set by query)': function(){
    assert.response(server,{method:'GET',url:'/2?lang=fr'},{status:200,body:'Avec un peu localisation du fichier de langue.'})
  },
  'with locale as context (sv from js set by query)': function(){
    assert.response(server,{method:'GET',url:'/2?lang=sv'},{status:200,body:'Med lite lokalisering från språkfilen.'})
  },
  'with a custom context': function(){
    assert.response(server,{method:'GET',url:'/3'},{status:200,body:'With some BULA from the locale file.'})
  },
  'with a custom context (sv from js set by query)': function(){
    assert.response(server,{method:'GET',url:'/3?lang=sv'},{status:200,body:'Med lite BULA från språkfilen.'})
  },
  'with a custom context (fr from js set by query)': function(){
    assert.response(server,{method:'GET',url:'/3?lang=fr'},{status:200,body:'Avec un peu BULA du fichier de langue.'})
  }
}