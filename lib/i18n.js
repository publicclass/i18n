/*!
 * I18n
 * Copyright(c) 2011 Robert Sköld <robert@publicclass.se>
 * MIT Licensed
 */

var join = require('path').join;


/**
 * Expose `I18n()`.
 */
module.exports = I18n;


/**
* I18n.
*
*
* A template is a function with the definition of `function(str,context)`. 
* It synchronously interpolates the locale string. `template` defaults to
* `I18n.defaultTemplate` which is a Ruby On Rails-like implementation which 
* interpolates keys inside `%{}`.
*
* If `path` is not set it defaults to `process.cwd()`. And `lang` defaults to
* `I18n.defaultLanguage`. 
*   
* @param {String} lang
* @param {String} path
* @param {Function} template
* @return {I18n} 
*/
function I18n(lang,path,template){
  if( !(this instanceof I18n) )
    return new I18n(lang,path,template);
  this.paths = [];
  this.locales = [];
  this.lang = lang || I18n.defaultLanguage;
  this.template = template || I18n.defaultTemplate;
  this.load(path || I18n.defaultPath);
}


/**
 * Load.
 *
 * Loads a locale `.js` or `.json` file from `path` or from `path/lang`. 
 *
 * @param {String} path
 * @return {I18n} 
 */
I18n.prototype.load = function(path){
  // ignore undefined paths
  if( !path )
    return this;

  // ignore already loaded paths
  if( ~this.paths.indexOf(path) ) 
    return this;

  // lookup lang and load it into this.locale
  var locale = load(join(path,this.lang)) || (load(path)||{})[this.lang];

  // add the locale into ´this.locales´ and the path to ´this.paths´
  if( locale ){
    this.locales.push(locale);
    this.paths.push(path);
  }

  // return self
  return this;
}


/**
 * Reload.
 *
 * Clears and reloads all the paths related to this lang. Useful for when 
 * the locale files or ´this.lang´ of this I18n instance has been changed.
 *
 * @param {String} path
 * @return {I18n} 
 */
I18n.prototype.reload = function(){
  // clear this.locales
  this.locales = [];

  // (re)load each path in order
  for(var i=0; i<this.paths.length; i++)
    this.load(this.paths[i]);
  
  // return self
  return this;
}

/**
 * Clone.
 *
 * Create a copy of the i18n instance.
 */
I18n.prototype.clone = function(){
  var i18n = new I18n(this.lang,null,this.template);
  i18n.paths = this.paths.concat();
  i18n.locales = this.locales.concat();
  return i18n;
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
  var ret = this.lookup(item);

  // not found
  if( typeof ret == 'undefined' ){
    // no context
    if( typeof context == 'undefined' )
      return I18n.defaultMissing;

    // an object context
    if( typeof context == 'object' )
      return 'default' in context ? context.default : I18n.defaultMissing;

    // context might be string or number
    return context;
  }

  // interpolate with context
  if( typeof context == "object" ){
    // pluralize
    if( !isNaN(context.count) )
      ret = (context.count !== 1 ? ret.other || ret[1] : ret.one || ret[0]) || ret;
    return this.template(ret,context);
  }
  return ret;
}


/**
 * Locale.
 *
 * A shorthand that returns a merged version of all locales.
 *
 * Used by the the middleware `t()`-helper. And useful for debugging.
 *
 * @api semi-private
 */
I18n.prototype.__defineGetter__('locale',function(){
  var locale = {};
  for( var i=0; i < this.locales.length; i++ )
    merge(locale,this.locales[i]);
  return locale;
})


/**
 * Lookup.
 *
 * Goes through the loaded locales to find one that matches, in LIFO order.
 *
 * @api semi-private
 */
I18n.prototype.lookup = function(item){
  for( var i=this.locales.length-1, ret; i >= 0; i-- )
    if( ret = lookup(item,this.locales[i]) )
      return ret;
}


/**
 * I18n - Middleware.
 * 
 * Connect/Express friendly middleware which attaches an I18n instance 
 * on the `request`. 
 *
 * On Express it will also provide a translation helper, `t()`, for the views.
 *
 * Examples:
 *
 *      // attach middleware
 *      app.use(I18n.middleware('fr',__dirname+'/locale'))
 *
 *      // in an ejs template
 *      <p><%= t('name',{name:'Bob'}) %></p>
 *
 *      // in a jade template
 *      p= t('name',{name:'Bob'})
 * 
 * @param {String} lang
 * @param {String} path
 * @return {Function}
 */
I18n.middleware = function middleware(lang,path){
  return function(req,res,next){
    var app = req.app;

    // lookup i18n by language
    app.i18n = app.i18n || {};

    // lazy get an I18n instance (to make sure we use the latest app settings)
    req.__defineGetter__('i18n',function(){
      var l = app.set("i18n lang") || lang
        , p = app.set("i18n path") || path
        , t = app.set("i18n template")
        , i18n = app.i18n[l];
      
      // not found, check if parent has one to clone
      if( !i18n && app.parent && app.parent.i18n && app.parent.i18n[l] )
        i18n = app.parent.i18n[l].clone();

      // still not found, creating a new one
      if( !i18n )
        i18n = new I18n(l,p,t);

      // cache it on app and add path
      return app.i18n[l] = i18n.load(p);
    })

    // express helper
    function helper(key,context){ 
      return req.i18n.t(key,context||req.i18n.locale)
    }

    // register a `t()` helper 
    if( typeof res.locals == 'function' )
      res.locals({t: helper});
    if( app && app.locals )
      app.locals.t = helper;
    
    // next middleware!
    next()

    // clear the app settings (or it will be kept across requests)
    app.set("i18n lang",null)
    app.set("i18n path",null)
  }
}


/**
 * Default Language.
 */
I18n.defaultLanguage = 'en';


/**
 * Default Path.
 */
I18n.defaultPath = process.cwd();


/**
 * Default missing.
 *
 * Used when context does not provide a default.
 */
I18n.defaultMissing = '';


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
  var self = this;
  return String(str).replace(/%{([^}]+?)}/ig,function replace(match,key){
    return ~key.indexOf('.') ? lookup(key,context) : context[key]
  })
  return res;
}


/**
 * Lookup helper.
 * 
 * Goes through a context for a matching dot-notated pattern.
 *
 * @param {String} key
 * @param {Object} context
 * @return {String}
 */
function lookup(key,context){
  var ret, part, parts = String(key).split(".");
  while( part = parts.shift() ){
    ret = ret ? ret[part] : context[part];
    if( typeof ret === "undefined" )
      break;
  }
  return ret
}

/**
 * Load helper.
 *
 * Uses require() but it returns `null` instead in case it could not be found 
 * instead of throwing an error.
 *
 * @param {String} path
 * @return {Module}
 */
function load(path){
  try {
    return require(path);
  } catch(e){
    if( ~e.message.indexOf('Cannot find module') )
      return null
    throw e;
  }
}


/**
 * Merge helper.
 *
 * Recursively merges object `b` into object `a` which is then returned.
 *
 * @param {Object} a
 * @param {Object} b 
 * @return {Object}
 */
function merge(a,b){
  for(var k in b)
    a[k] = Array.isArray(b[k]) || typeof b[k] == 'object' 
      ? merge(a[k]||{},b[k]) 
      : b[k];
  return a;
}
