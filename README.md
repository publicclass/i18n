# I18n 

A very simple localization utility which integrates nicely with [expressjs](http://expressjs.com).


## Install
	
As I can't think of a good npm package name right now (the obvious ones are already taken) right now you'll have to add this repository to your `package.json`.


	// package.json
	...
	"dependencies":{
		...
		"i18n": "git://github.com/publicclass/i18n.git"
	}


## Test

Clone the repository, install the dev dependencies and run `npm test`

	$ git clone git://github.com/publicclass/i18n.git
	$ cd i18n
	$ npm install -d
	$ npm test

## Usage

Create a locale file in one of these ways:

	// en.json
	{ "a": { "very": { "simple": "obj with a string" } },
		"ejs": "I contain an <%= a.very.simple %>" }

	// locale/en.js
	module.exports = {
		a: { very: { simple: "obj with a string" } },
		ejs: "I contain an <%= a.very.simple %>"
	}

	// locale.js
	exports.en = {
		yes: "yes",
		no: "no"
	}
	exports.sv = {
		yes: "ja",
		no: "nej"
	}


Recommended use is through express by adding it as a middleware:

	server.use(I18n.middleware("en",__dirname+"/locale"))


And then you may change the settings whenever you'd like with:

	server.set("i18n path",__dirname+"/locale")
	server.set("i18n lang","en")

For instance by reacting to a query param or 'Accept-Language'-header:

	// Directly in the Route
	server.get("/",function(req,res,next){
		server.set("i18n lang",req.query.lang);
		res.render("index");
	})

	// Or using a simple middleware
	server.use(function(req,res,next){
		req.app.set('i18n lang',req.query.lang || req.app.get('accept-language'))
	})


Then it's available in your templates (as a registered helper) like this:

	// ejs
	I haz <%= t("a.very.simple") %>

	// jade (or how is helpers called within jade?)
	p= t "a.very.simple"
	
	
And when used in express it automatically sets the context when rendering to the locale itself, so you'll be able to access a.very.simple in the 'ejs' localized string example above as expected. _NOTE: However this will not apply automatically when using the I18n instance by itself._


## TODO

*	Be able to pass an URI to the locale file from where it will be loaded:

		server.set("i18n path","https://gist.github.com/raw/93f9b13da1ac68408515/e4b5a4f58edd0fb284d2e1d33a72a9a8b3d664a7/hosted-locale.js")
		server.set("i18n ping","always")
	
	*	Possible "i18n ping" options: "never" (default on NODE\_ENV=production), "always" (default on NODE_ENV=development), "30m" (time based, every 30 min in this example) or "15r" (request based, every 15 requests)
	*	Should force refresh the locale on shift-reload in the browser (Is that the "Pragma: no-cache"-header?)


## Thanks to

* [OhaiBBQ](https://github.com/OhaiBBQ), who wrote [the original version](https://github.com/OhaiBBQ/node-i18n) that I simply improved upon.

* [TJ Holowaychuck](https://github.com/visionmedia), for the incredibly simple [expressjs server](http://expressjs.com/).

* [SenchaLabs](https://github.com/senchalabs), for the clever [connect middleware layer](https://github.com/senchalabs/connect) which is the base of expressjs.

* [Masylum](https://github.com/masylum), for [connect-i18n](https://github.com/masylum/connect-i18n) which parses the "accept-language"-header.


## License 

(The MIT License)

Copyright (c) 2011 Robert Sk&ouml;ld &lt;robert@publicclass.se&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.