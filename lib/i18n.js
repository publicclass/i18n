/*!
 * I18n
 * Copyright(c) 2011 Robert Sköld <robert@publicclass.se>
 * MIT Licensed
 */



/**
* A localization module. 
*   
* @param {String} path      The path of the locale file.
* @param {String} lang      The language to use.
* @param {String} template  (optional) The name of the render engine to use whenever a context has been passed along.
*/
function I18n(lang,path,template){
  path = path || process.cwd();
  lang = lang || I18n.defaultLanguage;
  try {
    this.locale = require(path+"/"+lang)
  } catch(e){
    this.locale = require(path)[lang]
  }
  this.template = template || this.locale._engine || I18n.defaultTemplate;
}

/**
 * Translate.
 *
 * Fetches a localized string from the locale file based on a key. Nested
 * keys can be accessed through dot-notation. 
 *
 * A context may also be passed, which is then used for interpolation
 * within that string. If a context also has a 'count'-property and the
 * interpolated key is corresponds to an Object (like {one:"X",other:"Y"}) or
 * an Array with two elements (like [1,N]).
 *
 * Examples:
 *      
 *      // en.json
 *      {"copy":"This is a piece of copy",
 *       "name":"Hi, my name is %{name}",
 *       "family":"My dad is %{father.age} and my mom is %{mother.age}",
 *       "deeper":{"than":{"that": "Here!"}},
 *       "inbox":{
 *          "one":"1 message",
 *          "other":"%{count} messages"
 *        },
 *       "inbox2":["1 message","%{count} messages"]}
 *      
 *      var i18n = new I18n(); // loads 'en' in ´process.cwd()´ by default.
 *
 *      i18n.t('copy')
 *      // => 'This is a piece of copy.'
 *      
 *      i18n.t('name',{name:'Bob'})
 *      // => 'Hi, my name is Bob'
 *
 *      i18n.t('inbox',{count:5})
 *      // => '5 messages'
 *
 *      i18n.t('inbox',{count:1})
 *      // => '1 message'
 *
 *      i18n.t('deeper.than.that')
 *      // => 'Here!'
 *
 *      i18n.t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})
 *      // => 'My dad is 45 and my mom is 47'
 *
 *
 * @param {String} item
 * @param {Object} context
 * @return {String}
 */
I18n.prototype.t = 
I18n.prototype.translate = function translate(item, context){
  var ret, part, item = item.split(".");
  while( part = item.shift() ){
    ret = ret ? ret[part] : this.locale[part];
    if( typeof ret === "undefined" )
      return "";
  }
  if( typeof context === "object" ){
    // Some pluralizing fun!
    if( context.count )
      ret = (context.count != 1 ? ret.other : ret.one) || ret;
    return this.template(ret,context) || context.default;
  }
  return ret;
}


/**
 * I18n - Middleware.
 * 
 * Connect/Express friendly middleware which attaches an I18n instance 
 * on the `request`. 
 *
 * On Express (3.x) it will also provide a translation helper function
 * for the views.
 *
 * Examples:
 *
 *      // register middleware
 *      app.use(I18n.middleware('fr',__dirname+'/locale'))
 *
 *      // in an ejs template
 *      <%= t('name',{name:'Bob'}) %>
 *
 *      // in a jade template
 *      p= t('name',{name:'Bob'})
 * 
 * @param {String} lang
 * @param {String} path
 * @return {Function}
 */
I18n.middleware = function middleware(lang,path){
  var _i18n = {};
  return function(req,res,next){
    // Lazy get an I18n instance
    req.__defineGetter__('i18n',function(){
      // Use the app settings first (in case they've been changed)
      // TODO Use req.get('accept-language') in a clever way
      var l = req.app.get("i18n lang") || lang
        , p = req.app.get("i18n path") || path
        , k = l+':'+p;

      // Add an I18n instance to the app (and cache it)
      return _i18n[k] || (_i18n[k] = new I18n(l,p));
    })

    // Register the "t" helper (in case of Express)
    if( req.app && req.app.locals ){
      req.app.locals.t = function(){
        return req.i18n.t.apply(req.i18n,arguments);
      }
    }
  
    next()
  }
}


/**
 * Default Language.
 */
I18n.defaultLanguage = 'en'


/**
 * Default Interpolation method.
 * 
 * Similar to the one used by Ruby On Rails, it has a ´%{keyword}´-syntax
 * which recursively finds the translation in the provided context in case 
 * it's a nested one.
 * 
 * @param {String} str
 * @param {Object} context
 * @return {String}
 */
I18n.defaultTemplate = function interpolation(str,context){
  // require("ejs").render(str,{locals:context})
  var t = this.t.bind(this);
  return String(str).replace(/%{([^}]+?)}/ig,function replace(match,key){return ~key.indexOf('.') ? t(key,context) : context[key]})
}


/**
 * Expose `I18n()`.
 */
module.exports = I18n;

