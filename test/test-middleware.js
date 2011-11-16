var server = require('./middleware/server')
  , assert = require('assert');

module.exports = {
  'server is running': function(){
    assert.response(server,{method:'GET',url:'/1'},{status:200,body:'This is just a plain string'})
  },
  'with locale as context': function(){
    assert.response(server,{method:'GET',url:'/2'},{status:200,body:'With some localization from the locale file.'})
  },
  'with locale as context (fr from json set by query)': function(){
    assert.response(server,{method:'GET',url:'/2?lang=fr'},{status:200,body:'Avec un peu localisation du fichier de langue.'})
  },
  'with locale as context (sv from js set by query)': function(){
    assert.response(server,{method:'GET',url:'/2?lang=sv'},{status:200,body:'Med lite lokalisering från språkfilen.'})
  },
  'with a custom context': function(){
    assert.response(server,{method:'GET',url:'/3'},{status:200,body:'With some BULA from the locale file.'})
  },
  'with a custom context (sv from js set by query)': function(){
    assert.response(server,{method:'GET',url:'/3?lang=sv'},{status:200,body:'Med lite BULA från språkfilen.'})
  },
  'with a custom context (fr from js set by query)': function(){
    assert.response(server,{method:'GET',url:'/3?lang=fr'},{status:200,body:'Avec un peu BULA du fichier de langue.'})
  }
}