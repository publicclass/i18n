/**
*   A simple localization module. Based upon https://github.com/OhaiBBQ/node-i18n
*   
*   Create a locale file like:
*  
*     // locale/en.js
*     module.exports = {
*       a: {
*         very: {
*           simple: "obj with a string"
*         }
*       },
*       ejs: "I contain <%= 'a.very.simple' %>"
*     }
*  
*   
*   Recommended use is through express (registers itself if express is available):
*  
*     server.use(express.i18n(__dirname+"/locale","en"))
*  
*  
*   And change the settings whenever you'd like with:
*  
*     server.set("i18n path",__dirname+"/locale")
*     server.set("i18n lang","en")
*  
*  
*   For instance by reacting to a query param:
*  
*     server.get("/",function(req,res,next){
*       server.set("i18n lang",req.query.lang || "en");
*       res.render("index");
*     })
*  
*  
*   Then it's available in your templates (as a registered helper) like this:
*  
*     // ejs
*     I haz <%= t("a.very.simple") %>
*  
*     // jade (or how is helpers called within jade?)
*     = t "a.very.simple"
*/

function I18n(path,lang){
  this.locale = require(path+"/"+lang)
}
I18n.prototype = {
  t: function(item, context) {
    var ret, part, item = item.split(".");
    while( part = item.shift() ){
      ret = ret ? ret[part] : this.locale[part];
      if( typeof ret === "undefined" )
        return "";
    }
    if( typeof context === "object" )
      return require("ejs").render(ret,context);
    return ret;
  }
}

try {
  var express = require("express");
  if( typeof express !== "undefined" ){
    var _i18n = {};
    express.i18n = function(path,lang){
      return function(req,res,next){
        // Use the settings (in case they've been changed)
        path = req.app.set("i18n path") || path;
        lang = req.app.set("i18n lang") || lang;
      
        if( !_i18n[path+"/"+lang] ){
          // Add an I18n instance to the app (and cache it)
          var i18n = _i18n[path+"/"+lang] = new I18n(path,lang);
          
          // Register the "t" helper
          req.app.helpers({t:function(item,context){
            return i18n.t(item,context||i18n.locale);
          }});
        }
        
        // Make the 'current' instance available.
        req.i18n = _i18n[path+"/"+lang];
        
        next()
      }
    }
  }  
} catch(e){}