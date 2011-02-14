
## Usage

Create a locale file like:

	// locale/en.js
	module.exports = {
		a: {
			very: {
				simple: "obj with a string"
			}
		},
		ejs: "I contain an <%= 'a.very.simple' %>"
	}

Or if you'd prefer to store multiple languages in one locale file (for whatever reason), you may do like this:

	// locale.js
	exports.en = {
		yes: "yes",
		no: "no"
	}
	exports.sv = {
		yes: "ja",
		no: "nej"
	}


Recommended use is through express (it registers itself if express is available):

	server.use(express.i18n(__dirname+"/locale","en"))


And then you may change the settings whenever you'd like with:

	server.set("i18n path",__dirname+"/locale")
	server.set("i18n lang","en")


For instance by reacting to a query param:

	server.get("/",function(req,res,next){
		server.set("i18n lang",req.query.lang || "en");
		res.render("index");
	})


Then it's available in your templates (as a registered helper) like this:

	// ejs
	I haz <%= t("a.very.simple") %>

	// jade (or how is helpers called within jade?)
	= t "a.very.simple"
