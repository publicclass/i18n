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

    it('using an set locale path (inherited)', function(done){
      request(app)
        .get('/6?lang=fr')
        .expect('Avec un peu BULA du fichier de langue.',done)
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



// We want a specific I18n instance per app and lang which is then extended 
// with paths. Example app structure:
//  / 
//    I18n.middleware('en',__dirname+'/locale')
//    app.i18n = {en: new I18n, fr: new I18n}
//    - en (./locale/en.js)
//    - fr (./locale/fr.js)
//  /1 (child app)
//    I18n.middleware('en',__dirname)
//    app.i18n = {en: parent.i18n[en].extend(new I18n), fr: parent.i18n[fr].extend(new I18n), sv: new I18n}
//    - en (./locale/en.js,./en.json) < inherited from / and extended
//    - fr (./locale/fr.js) < inherited from /
//    - sv (./sv.js) < extended
//  /1/1 (childs child app)
//    I18n.middleware('en',__dirname)
//    app.i18n = {en: parent.i18n[en].extend(new I18n), fr: parent.i18n[fr].extend(new I18n), sv: new I18n}
//    - en (./locale/en.js,./en.json) < inherited from /1 and /
//    - fr (./locale/fr.js) < inherited from /
//    - sv (./sv.js) < inherited from /1
//  /2 (another child app)
//    app.i18n = parent.i18n (no middleware used, req will be passed along and use parent.i18n if no local exists)
//    - en (./locale/en.js) < inherited from /
//    - fr (./locale/fr.js) < inherited from /

describe('nested', function(){
  var express = require('express')
    , I18n = require('../');

  // child with middleware
  var child = express();
  child.set('views',__dirname+'/middleware')
  child.use(I18n.middleware('en',__dirname+'/middleware')); // = test/middleware/en.js
  child.get('/',function(req,res){ res.send(req.i18n.t(req.params.key,req.query)) })
  child.get('/ejs',function(req,res){ res.render("index.ejs")})
  child.get('/:key?',function(req,res){ res.send(req.i18n.t(req.params.key,req.query)) })
    
  // TODO support child without a middleware
  var child2 = express();
  child2.set('views',__dirname+'/middleware')
  child2.get('/',function(req,res){res.render("index.ejs")})

  var parent = express();
  parent.use(I18n.middleware('en',__dirname)); // = test/en.json

  // mount after i18n to make sure i18n is on the stack already (or it won't merge)
  parent.use('/child',child); 
  parent.use('/child2',child2); 

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
    // test `t()`
    it('should render with a template',function(done){
      request(parent)
        .get('/child/ejs')
        .expect('<p>With some localization from the locale file.</p>',done)
    })
  })

  // TODO child apps should inherit parents helper
  // describe('/child2', function(){
  //   it('should respond',function(done){
  //     request(parent)
  //       .get('/child2')
  //       .expect(200,done);
  //   })

  //   // test `t()`
  //   it('should render with a template',function(done){
  //     request(parent)
  //       .get('/child2')
  //       .expect('<p>With some localization from the locale file.</p>',done)
  //   })
  // })

})