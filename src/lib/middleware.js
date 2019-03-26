import { invoke as bodyParser} from './body.parser'

export var kawixDynamic= {
	time: 15000
}

export var invoke= async function(env, ctx){
	env.reply.header("access-allow-control-origin", "*")
	await bodyParser(env,ctx)
}
