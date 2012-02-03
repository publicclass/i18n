var app = require('./middleware/server2.x.js')
  , request = require('./support/http');


describe('express 2.x',function(){
  
  it('server is running', function(done){
    request(app)
      .get('/1')
      .expect('This is just a plain string',done)
  })

  describe('en',function(){

    it('with locale as context', function(done){
      request(app)
        .get('/2')
        .expect('With some localization from the locale file.',done)
    })
      
    it('with a custom context', function(done){
      request(app)
        .get('/3')
        .expect('With some BULA from the locale file.',done)
    })

    it('using an ejs template', function(done){
      request(app)
        .get('/4')
        .expect('<p>With some localization from the locale file.</p>',done)
    })

    it('using a jade template', function(done){
      request(app)
        .get('/5')
        .expect('<p>With some localization from the locale file.</p>',done)
    })

    it('using an set locale path', function(done){
      request(app)
        .get('/6')
        .expect('With some BULA from another locale file.',done)
    })

  })

  describe('fr',function(){

    it('with locale as context', function(done){
      request(app)
        .get('/2?lang=fr')
        .expect('Avec un peu localisation du fichier de langue.',done)
    })
      
    it('with a custom context', function(done){
      request(app)
        .get('/3?lang=fr')
        .expect('Avec un peu BULA du fichier de langue.',done)
    })

    it('using an ejs template', function(done){
      request(app)
        .get('/4?lang=fr')
        .expect('<p>Avec un peu localisation du fichier de langue.</p>',done)
    })

    it('using a jade template', function(done){
      request(app)
        .get('/5?lang=fr')
        .expect('<p>Avec un peu localisation du fichier de langue.</p>',done)
    })

    it('using an set locale path (no locale)', function(done){
      request(app)
        .get('/6?lang=fr')
        .expect('',done)
    })
    
  })

  describe('sv',function(){

    it('with locale as context', function(done){
      request(app)
        .get('/2?lang=sv')
        .expect('Med lite lokalisering från språkfilen.',done)
    })
      
    it('with a custom context', function(done){
      request(app)
        .get('/3?lang=sv')
        .expect('Med lite BULA från språkfilen.',done)
    })

    it('using an ejs template', function(done){
      request(app)
        .get('/4?lang=sv')
        .expect('<p>Med lite lokalisering från språkfilen.</p>',done)
    })

    it('using a jade template', function(done){
      request(app)
        .get('/5?lang=sv')
        .expect('<p>Med lite lokalisering från språkfilen.</p>',done)
    })

    it('using an set locale path', function(done){
      request(app)
        .get('/6?lang=sv')
        .expect('Med lite BULA från en annan språkfil.',done)
    })
    
  })

})