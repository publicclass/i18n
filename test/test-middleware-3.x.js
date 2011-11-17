var server = require('./middleware/server3.x.js')
  , assert = require('assert');

module.exports = {
  'server is running': function(){
    assert.response(server,{method:'GET',url:'/1'},{status:200,body:'This is just a plain string'})
  },
  'with locale as context (en)': function(){
    assert.response(server,{method:'GET',url:'/2'},{status:200,body:'With some localization from the locale file.'})
  },
  'with locale as context (fr)': function(){
    assert.response(server,{method:'GET',url:'/2?lang=fr'},{status:200,body:'Avec un peu localisation du fichier de langue.'})
  },
  'with locale as context (sv)': function(){
    assert.response(server,{method:'GET',url:'/2?lang=sv'},{status:200,body:'Med lite lokalisering från språkfilen.'})
  },
  'with a custom context (en)': function(){
    assert.response(server,{method:'GET',url:'/3'},{status:200,body:'With some BULA from the locale file.'})
  },
  'with a custom context (sv)': function(){
    assert.response(server,{method:'GET',url:'/3?lang=sv'},{status:200,body:'Med lite BULA från språkfilen.'})
  },
  'with a custom context (fr)': function(){
    assert.response(server,{method:'GET',url:'/3?lang=fr'},{status:200,body:'Avec un peu BULA du fichier de langue.'})
  },
  'using an ejs template (en)': function(){
   assert.response(server,{method:'GET',url:'/4'},{status:200,body:'<p>With some localization from the locale file.</p>'}) 
  },
  'using an ejs template (fr)': function(){
   assert.response(server,{method:'GET',url:'/4?lang=fr'},{status:200,body:'<p>Avec un peu localisation du fichier de langue.</p>'}) 
  },
  'using an ejs template (sv)': function(){
   assert.response(server,{method:'GET',url:'/4?lang=sv'},{status:200,body:'<p>Med lite lokalisering från språkfilen.</p>'}) 
  },
  'using a jade template (en)': function(){
   assert.response(server,{method:'GET',url:'/5'},{status:200,body:'<p>With some localization from the locale file.</p>'}) 
  },
  'using a jade template (fr)': function(){
   assert.response(server,{method:'GET',url:'/5?lang=fr'},{status:200,body:'<p>Avec un peu localisation du fichier de langue.</p>'}) 
  },
  'using a jade template (sv)': function(){
   assert.response(server,{method:'GET',url:'/5?lang=sv'},{status:200,body:'<p>Med lite lokalisering från språkfilen.</p>'}) 
  },
  'using an set locale path (en)': function(){
   assert.response(server,{method:'GET',url:'/6'},{status:200,body:'With some BULA from another locale file.'}) 
  },
  'using an set locale path (sv)': function(){
   assert.response(server,{method:'GET',url:'/6?lang=sv'},{status:200,body:'Med lite BULA från en annan språkfil.'}) 
  }
}