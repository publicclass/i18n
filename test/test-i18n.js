var I18n = require('../')
  , assert = require('assert')
  , en = new I18n()
  , fr = new I18n('fr')
  , sv = new I18n('sv',__dirname+'/locale'); 

module.exports = {
  "en.t('none')":function(){
    assert.equal(en.t('none'),'')
  },
  "en.t('none',{default:'none'})":function(){
    assert.equal(en.t('none',{default:'none'}),'none')
  },
  "en.t('yes')":function(){
    assert.equal(en.t('yes'),'Yes')
  },
  "en.t('inbox',{count:5})":function(){
    assert.equal(en.t('inbox',{count:5}),'5 messages')
  },
  "en.t('inbox',{count:0})":function(){
    assert.equal(en.t('inbox',{count:0}),'0 messages')
  },
  "en.t('inbox',{count:1})":function(){
    assert.equal(en.t('inbox',{count:1}),'1 message')
  },
  "en.t('inbox2',{count:5})":function(){
    assert.equal(en.t('inbox',{count:5}),'5 messages')
  },
  "en.t('inbox2',{count:0})":function(){
    assert.equal(en.t('inbox',{count:0}),'0 messages')
  },
  "en.t('inbox2',{count:1})":function(){
    assert.equal(en.t('inbox',{count:1}),'1 message')
  },
  "en.t('deeper.than.that')":function(){
    assert.equal(en.t('deeper.than.that'),'Here!')
  },
  "en.t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})":function(){
    assert.equal(en.t('family',{father:{name:'Bob',age:45},mother:{name:'Alice',age:47}}),'My dad is 45 and my mom is 47')
  }
}

// TODO Test using another template engine, something like:
// function(str,context){
//   return require("ejs").render(str,{locals:context})
// }