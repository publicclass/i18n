// Since the tests usually is run from the root we chdir to __dirname first.
process.chdir(__dirname);

var I18n = require('../')
  , en = new I18n()
  , fr = new I18n('fr')
  , sv = new I18n('sv',__dirname+'/locale'); 

describe('i18n',function(){
  
  describe('en',function(){
    it('.t == .translate',function(){
      en.t.should.equal(en.translate)
    })
    it('.t("none")',function(){
      en.t('none').should.equal('')
    })
    it('.t("none",{default:"none"})',function(){
      en.t('none',{default:'none'}).should.equal('none')
    })
    it('.t("yes")',function(){
      en.t('yes').should.equal('Yes')
    })
    it('.t("inbox",{count:5})',function(){
      en.t('inbox',{count:5}).should.equal('5 messages')
    })
    it(".t('inbox',{count:0})",function(){
      en.t('inbox',{count:0}).should.equal('0 messages')
    })
    it(".t('inbox',{count:1})",function(){
      en.t('inbox',{count:1}).should.equal('1 message')
    })
    it(".t('inbox2',{count:5})",function(){
      en.t('inbox2',{count:5}).should.equal('5 messages')
    })
    it(".t('inbox2',{count:0})",function(){
      en.t('inbox2',{count:0}).should.equal('0 messages')
    })
    it(".t('inbox2',{count:1})",function(){
      en.t('inbox2',{count:1}).should.equal('1 message')
    })
    it(".t('deeper.than.that')",function(){
      en.t('deeper.than.that').should.equal('Here!')
    })
    it(".t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})",function(){
      en.t('family',{father:{name:'Bob',age:45},mother:{name:'Alice',age:47}}).should.equal('My dad is 45 and my mom is 47')
    })
  })


  describe('fr',function(){
    it('.t == .translate',function(){
      fr.t.should.equal(fr.translate)
    })
    it('.t("none")',function(){
      fr.t('none').should.equal('')
    })
    it('.t("none",{default:"none"})',function(){
      fr.t('none',{default:'none'}).should.equal('none')
    })
    it('.t("yes")',function(){
      fr.t('yes').should.equal('Oui')
    })
    it('.t("inbox",{count:5})',function(){
      fr.t('inbox',{count:5}).should.equal('5 messages')
    })
    it(".t('inbox',{count:0})",function(){
      fr.t('inbox',{count:0}).should.equal('0 messages')
    })
    it(".t('inbox',{count:1})",function(){
      fr.t('inbox',{count:1}).should.equal('1 message')
    })
    it(".t('inbox2',{count:5})",function(){
      fr.t('inbox2',{count:5}).should.equal('5 messages')
    })
    it(".t('inbox2',{count:0})",function(){
      fr.t('inbox2',{count:0}).should.equal('0 messages')
    })
    it(".t('inbox2',{count:1})",function(){
      fr.t('inbox2',{count:1}).should.equal('1 message')
    })
    it(".t('deeper.than.that')",function(){
      fr.t('deeper.than.that').should.equal('Voici!')
    })
    it(".t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})",function(){
      fr.t('family',{father:{name:'Bob',age:45},mother:{name:'Alice',age:47}}).should.equal('Mon papa est 45 et ma mère est 47')
    })
  })


  describe('sv',function(){
    it('.t == .translate',function(){
      sv.t.should.equal(sv.translate)
    })
    it('.t("none")',function(){
      sv.t('none').should.equal('')
    })
    it('.t("none",{default:"none"})',function(){
      sv.t('none',{default:'none'}).should.equal('none')
    })
    it('.t("yes")',function(){
      sv.t('yes').should.equal('Ja')
    })
    it('.t("inbox",{count:5})',function(){
      sv.t('inbox',{count:5}).should.equal('5 meddelanden')
    })
    it(".t('inbox',{count:0})",function(){
      sv.t('inbox',{count:0}).should.equal('0 meddelanden')
    })
    it(".t('inbox',{count:1})",function(){
      sv.t('inbox',{count:1}).should.equal('1 meddelande')
    })
    it(".t('inbox2',{count:5})",function(){
      sv.t('inbox2',{count:5}).should.equal('5 meddelanden')
    })
    it(".t('inbox2',{count:0})",function(){
      sv.t('inbox2',{count:0}).should.equal('0 meddelanden')
    })
    it(".t('inbox2',{count:1})",function(){
      sv.t('inbox2',{count:1}).should.equal('1 meddelande')
    })
    it(".t('deeper.than.that')",function(){
      sv.t('deeper.than.that').should.equal('Här!')
    })
    it(".t('family',{father:{name:'Bob',age:45},mother:{name'Alice',age:47}})",function(){
      sv.t('family',{father:{name:'Bob',age:45},mother:{name:'Alice',age:47}}).should.equal('Min pappa är 45 år och min mamma är 47 år')
    })
  })

})

// TODO Test using another template engine, something like:
// function(str,context){
//   return require("ejs").render(str,{locals:context})
// }