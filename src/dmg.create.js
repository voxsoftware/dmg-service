
import fs from 'https://kwx.kodhe.com/x/v/0.3.1/std/fs/mod.js'
import Path from 'path'
import Os from 'os'

import axios from 'npm://axios@^0.18.0'
import uniqid from 'https://kwx.kodhe.com/x/v/0.3.1/std/util/uniqid.js'
import fsextra from 'npm://fs-extra@^7.x'
// npmi:// is for allow modules that depends on native 
import appdmg from 'npmi://appdmg@^0.5.2'
import Exception from './exception'
import state from './lib/state'

var tmpdir, deferred, Unarchiver


deferred= function(){
	var def= {}
	def.promise= new Promise(function(a,b){
		def.resolve= a
		def.reject = b
	})
	return def
}

export var kawixDynamic= {
	time: 15000
}


export var invoke= async function(env,ctx){
	var body, response, def, fileout, stream, streamIn,
		files, file, folderout, config, generated, dmg,
		progress, name, basename

	try{

		state.count++
		if(state.count > 4){
			throw Exception.create("Just now is being generated 4 DMG files in this process. Please try again").putCode("BUSY")
		}

		if(!tmpdir){
			tmpdir= Path.join(Os.homedir(), ".kawi", "dmg-service")
			if(!fs.existsSync(tmpdir)){
				fs.mkdirSync(tmpdir)
			}
			tmpdir= Path.join(tmpdir, "tmp")
			if(!fs.existsSync(tmpdir)){
				fs.mkdirSync(tmpdir)
			}
		}


		body= env.body
		if(body.url){
			// download from file
			response= await axios({
				method:'get',
				url: body.url,
				responseType:'stream'
			})
			streamIn= response.data
		}
		else{
			streamIn= env.request
		}

		fileout= Path.join(tmpdir, uniqid())
		stream= fs.createWriteStream(fileout)
		def= deferred()
		streamIn.on("error", def.reject)
		stream.on("error", def.reject)
		stream.on("finish", def.resolve)
		streamIn.pipe(stream)
		await def.promise


		folderout = fileout + ".folder"
		if(!fs.existsSync(folderout)){
			await fs.mkdirAsync(folderout)
		}




		if(!Unarchiver){
			Unarchiver= {
				decompress: await import("npm://decompress@^4.2.0"),
				decompress_unzip: await import("npm://decompress-unzip@^4.0.1"),
				decompress_tar: await import("npm://decompress-targz@^4.1.1")
			}
		}
		
		await Unarchiver.decompress(fileout, folderout, {
			plugins: [Unarchiver.decompress_unzip(), Unarchiver.decompress_tar()]
		})

		files= await fs.readdirAsync(folderout)
		config= {}
		for(let i=0;i<files.length;i++){
			file= Path.join(folderout, files[i])
			if(file.endsWith("/appdmg.json")){
				// read this file as config
				config.paramfile= file
			}
			else if(file.endsWith(".app")){
				config.appfile= file
			}
		}

		basename= body.name || Path.basename( (config.appfile || "generated") , '.app')
		if(!config.paramfile){
		
			if(!config.appfile){
				throw Exception.create("Cannot find an appdmg.json file").putCode("INVALID_CONFIG")
			}

			// create a default file 
			config.paramfile= folderout + "/.app.dmg.json"
			config.default= {
				"title": basename,
				"contents": [
				  { "x": 350, "y": 140, "type": "link", "path": "/Applications" },
				  { "x": 150, "y": 140, "type": "file", "path": "./" + Path.basename(config.appfile) }
				],
				"window":{
					"size":{
						"width": 546,
						"height": 326
					}
				}
			}
			await fs.writeFileAsync(config.paramfile, JSON.stringify(config.default))


		}
		else{
			config.default= JSON.parse(await fs.readFileAsync(config.paramfile,'utf8'))
			if(!config.default.title){
				config.default.title= basename 
				await fs.writeFileAsync(config.paramfile, JSON.stringify(config.default))
			}
			basename= (body.name || config.default.title)
		}

		// make the DMG
		basename+=".dmg"
		name=  Path.basename( (config.appfile || "generated-") + uniqid(), '.app') + ".dmg"
		generated= Path.join(__dirname, "..", "generated", name)
		progress= []
		dmg= appdmg({
			source: config.paramfile,
			target: generated
		})

		def= deferred()
		dmg.on("progress", progress.push.bind(progress))
		dmg.on("finish", def.resolve)
		dmg.on("error", def.reject)
		await def.promise




		env.reply.code(200).send({
			url: "download/" + name + "?name=" + basename,
			result: progress			
		})

	}
	catch(e){
		env.reply.code(500).send({
			error:{
				message: e.message,
				code: e.code,
				stack: e.stack
			}
		})
	}
	finally{
		state.count--
		if(fileout && fs.existsSync(fileout)){
			// unlink
			await fs.unlinkAsync(fileout)
		}
		if(folderout && fs.existsSync(folderout)){
			// RMDIR
			await fsextra.remove(folderout)
		}
	}
}
