// Since the tests usually is run from the root we chdir to __dirname first.
process.chdir(__dirname);

var I18n = require('../')
  , assert = require('assert')
  , en = new I18n()
  , fr = new I18n('fr')
  , sv = new I18n('sv',__dirname+'/locale'); 

module.exports = {
  "en.t == en.translate":function(){
    assert.equal(en.t,en.translate);
  },

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
  },


  "fr.t('none')":function(){
    assert.equal(fr.t('none'),'')
  },
  "fr.t('none',{default:'none'})":function(){
    assert.equal(fr.t('none',{default:'none'}),'none')
  },
  "fr.t('yes')":function(){
    assert.equal(fr.t('yes'),'Oui')
  },
  "fr.t('inbox',{count:5})":function(){
    assert.equal(fr.t('inbox',{count:5}),'5 messages')
  },
  "fr.t('inbox',{count:0})":function(){
    assert.equal(fr.t('inbox',{count:0}),'0 messages')
  },
  "fr.t('inbox',{count:1})":function(){
    assert.equal(fr.t('inbox',{count:1}),'1 message')
  },
  "fr.t('inbox2',{count:5})":function(){
    assert.equal(fr.t('inbox',{count:5}),'5 messages')
  },
  "fr.t('inbox2',{count:0})":function(){
    assert.equal(fr.t('inbox',{count:0}),'0 messages')
  },
  "fr.t('inbox2',{count:1})":function(){
    assert.equal(fr.t('inbox',{count:1}),'1 message')
  },
  "fr.t('deeper.than.that')":function(){
    assert.equal(fr.t('deeper.than.that'),'Voici!')
  },
  "fr.t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})":function(){
    assert.equal(fr.t('family',{father:{name:'Bob',age:45},mother:{name:'Alice',age:47}}),'Mon papa est 45 et ma mère est 47')
  },


  "sv.t('none')":function(){
    assert.equal(sv.t('none'),'')
  },
  "sv.t('none',{default:'none'})":function(){
    assert.equal(sv.t('none',{default:'none'}),'none')
  },
  "sv.t('yes')":function(){
    assert.equal(sv.t('yes'),'Ja')
  },
  "sv.t('inbox',{count:5})":function(){
    assert.equal(sv.t('inbox',{count:5}),'5 meddelanden')
  },
  "sv.t('inbox',{count:0})":function(){
    assert.equal(sv.t('inbox',{count:0}),'0 meddelanden')
  },
  "sv.t('inbox',{count:1})":function(){
    assert.equal(sv.t('inbox',{count:1}),'1 meddelande')
  },
  "sv.t('inbox2',{count:5})":function(){
    assert.equal(sv.t('inbox',{count:5}),'5 meddelanden')
  },
  "sv.t('inbox2',{count:0})":function(){
    assert.equal(sv.t('inbox',{count:0}),'0 meddelanden')
  },
  "sv.t('inbox2',{count:1})":function(){
    assert.equal(sv.t('inbox',{count:1}),'1 meddelande')
  },
  "sv.t('deeper.than.that')":function(){
    assert.equal(sv.t('deeper.than.that'),'Här!')
  },
  "sv.t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})":function(){
    assert.equal(sv.t('family',{father:{name:'Bob',age:45},mother:{name:'Alice',age:47}}),'Min pappa är 45 år och min mamma är 47 år')
  }
}

// TODO Test using another template engine, something like:
// function(str,context){
//   return require("ejs").render(str,{locals:context})
// }