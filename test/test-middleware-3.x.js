var request = require('./support/http');


describe('server.3.x',function(){
  var app = require('./middleware/server3.x.js');

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


describe('nested', function(){
  var express = require('express')
    , I18n = require('../');

  var child = express();
  child.use(I18n.middleware('en',__dirname+'/middleware')); // = test/middleware/en.js
  child.get('/:key?',function(req,res){ res.send(req.i18n.t(req.params.key,req.query)) })
    
  var parent = express();
  parent.use(I18n.middleware('en',__dirname)); // = test/en.json
  parent.use('/child',child); // mounted after i18n to make sure i18n is on the stack already (or it won't merge)
  parent.get('/:key?',function(req,res){ res.send(req.i18n.t(req.params.key,req.query)) })

  describe('/', function(){
    it('should respond',function(done){
      request(parent)
        .get('/')
        .expect(200,done);
    })
    it('should read "yes" as "Yes"',function(done){
      request(parent)
        .get('/yes')
        .expect('Yes',done);
    })
    it('should read "name" as "Hi, my name is Bob"',function(done){
      request(parent)
        .get('/name?name=Bob')
        .expect('Hi, my name is Bob',done);
    })
    it('should read "special" as ""',function(done){
      request(parent)
        .get('/special')
        .expect('',done);
    })
  })

  describe('/child', function(){
    it('should respond',function(done){
      request(parent)
        .get('/child')
        .expect(200,done);
    })
    // overridden
    it('should read "yes" as "I can!"',function(done){
      request(parent)
        .get('/child/yes')
        .expect('I can!',done);
    })
    // inherited
    it('should read "name" as "Hi, my name is Bobs Child"',function(done){
      request(parent)
        .get('/child/name?name=Bobs%20Child')
        .expect('Hi, my name is Bobs Child',done);
    })
    // only in sub-locale
    it('should read "special" as "Special!"',function(done){
      request(parent)
        .get('/child/special')
        .expect('Special!',done);
    })
  })

})