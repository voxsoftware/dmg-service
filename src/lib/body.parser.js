//# Kodhe copyright 2019©
//  Middleware for body parser
var Mod;
import bodyParser from 'npm://body-parser@1.18.3';
import state from './state';
Mod = {
	deferred: function(){
		var def= {}
		def.promise= new Promise(function(a,b){
			def.resolve= a 
			def.reject = b 
		})
		return def 
	},
  	invoke: async function(env, ctx) {
		var def, ref, ref1


		if (!state.jsonParser) {
			state.jsonParser = bodyParser.json({
				limit: '5mb'
			});
		}
		if (!state.urlencodedParser) {
			state.urlencodedParser = bodyParser.urlencoded({
				limit: '5mb'
			});
		}
		def = Mod.deferred();
		env.request.once("error", def.reject);
		state.jsonParser(env.request, env.response, def.resolve);
		await def.promise;
		if (!env.request.body) {
			def = Mod.deferred();
			state.urlencodedParser(env.request, env.response, def.resolve);
			await def.promise;
		}
		// union into env.body
		return env.body = Object.assign({}, (env.request && env.request.query) || {}, (env.request && env.request.body) || {});
  	}
};

export var invoke = Mod.invoke;

export var kawixDynamic = {
  time: 15000
};
