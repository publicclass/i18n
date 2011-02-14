/**
*   A localization module. Based upon https://github.com/OhaiBBQ/node-i18n
*   
*   @param {String} path      The path of the locale file.
*   @param {String} lang      The language to use.
*   @param {String} template  (optional) The name of the render engine to use whenever a context has been passed along.
*/

function I18n(path,lang,template){
  try {
    this.locale = require(path+"/"+(lang||exports.defaultLanguage))
  } catch(e){
    this.locale = require(path)[lang||exports.defaultLanguage]
  }
  this.template = template || this.locale._engine || exports.defaultTemplate;
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
      return require(this.template).render(ret,{locals:context});
    return ret;
  }
}

try {
  (function(express){
    if( !express ) return;
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
  })(require("express"))
} catch(e){}

exports.I18n = I18n;
exports.defaultLanguage = "en"
exports.defaultTemplate = "ejs"