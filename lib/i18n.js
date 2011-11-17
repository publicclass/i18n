/*!
 * I18n
 * Copyright(c) 2011 Robert Sköld <robert@publicclass.se>
 * MIT Licensed
 */



/**
* I18n.
*
* Loads a locale `.js` or `.json` file from `path` or from `path/lang`. If
* `path` is not set it defaults to `process.cwd()`. And `lang` defaults to
* `I18n.defaultLanguage`. 
*
* A template is a function with the definition of `function(str,context)`. 
* It synchronously interpolates the locale string. `template` defaults to
* `I18n.defaultTemplate` which is a Ruby On Rails-like implementation which 
* interpolates keys inside `%{}`.
*   
* @param {String} path
* @param {String} lang
* @param {Function} template
*/
function I18n(lang,path,template){
  this.lang = lang || I18n.defaultLanguage;
  this.path = path || process.cwd();
  this.template = template || I18n.defaultTemplate;
  this.locale = load(this.path+"/"+this.lang) || (load(this.path)||{})[this.lang] || {}
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
  var ret = lookup(item,this.locale);
  if( typeof ret === "undefined" )
    return context && context.default ? context.default : "";  

  // If we have a context we interpolate
  if( typeof context === "object" ){
    // Some pluralizing fun!
    if( !isNaN(context.count) )
      ret = (context.count !== 1 ? ret.other || ret[1] : ret.one || ret[0] ) || ret;
    return this.template(ret,context);
  }
  return ret;
}


/**
 * I18n - Middleware.
 * 
 * Connect/Express friendly middleware which attaches an I18n instance 
 * on the `request`. 
 *
 * On Express it will also provide a translation helper function for the views.
 *
 * Examples:
 *
 *      // attach middleware
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
      var l = req.app.set("i18n lang") || lang
        , p = req.app.set("i18n path") || path
        , k = l+':'+p;
      
      // Add an I18n instance to the app (and cache it)
      return _i18n[k] || (_i18n[k] = new I18n(l,p));
    })

    // Register a `t()` helper
    function helper(key,context){ return req.i18n.t(key,context||req.i18n.locale) }
    if( req.app && req.app.helpers ){
      req.app.helpers({t:helper});  // Express 2.x
    } else if( req.app && req.app.locals ){
      req.app.locals.t = helper;    // Express 3.x
    }
  
    next()

    // Clear the app settings (or it will be kept across sessions)
    req.app.set("i18n lang",null)
    req.app.set("i18n path",null)
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
  return String(str).replace(/%{([^}]+?)}/ig,function replace(match,key){
    return ~key.indexOf('.') ? lookup(key,context) : context[key]
  })
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
  var ret, part, parts = key.split(".");
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
 * Expose `I18n()`.
 */
module.exports = I18n;

