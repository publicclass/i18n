var express = require("express")
  , I18n = require("../../");

var app = module.exports = express()
app.set("views",__dirname)
app.use(I18n.middleware("en",__dirname))

/** 
 * A little middleware for changing locale based on a 'lang' query param.
 * 
 * Also makes sure it's set to `undefined` when no query has been used.
 * Because it's an 'app setting' it would otherwise've been kept across
 * requests which is probably less than ideal.
 */ 
app.use(function(req,res,next){
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
  res.render("index.ejs")
})

app.get("/5",function(req,res,next){
  res.render("index.jade")
})

app.get("/6",function(req,res,next){
  app.set("i18n path",__dirname+"/locale.js")
  res.send(req.i18n.t("embedded",{i:{can:{haz:"BULA"}}}))
})
