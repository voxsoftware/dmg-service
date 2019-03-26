export var kawixDynamic= {
	time: 15000
}

export var invoke= function(env, ctx){
	env.reply.header("access-allow-control-origin", "*")
}
