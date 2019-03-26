import kawixHttp from 'https://kwx.kodhe.com/x/v/0.3.1/std/http/mod.js'
import Path from 'path'

export var kawixDynamic= {
    time: 15000
}
var staticServer 
export var invoke= function(env){
    var path, body
    path= Path.join(__dirname, "..", "generated")
    body= env.body
    if(body && body.name){
        env.reply.header("content-disposition", "attachment;filename=" + body.name)
    }

    if(!staticServer)
        staticServer= kawixHttp.staticServe(path)
    
    return staticServer(env)
}