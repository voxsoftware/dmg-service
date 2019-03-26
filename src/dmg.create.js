
import fs from 'https://kwx.kodhe.com/x/v/0.3.1/std/fs/mod.js'
import Path from 'path'
import Os from 'os'

import axios from 'npm://axios@^0.18.0'
import uniqid from 'https://kwx.kodhe.com/x/v/0.3.1/std/util/uniqid.js'
import fsextra from 'npm://fs-extra@^7.x'
// npmi:// is for allow modules that depends on native 
import appdmg from 'npmi://appdmg@^0.5.2'
import Exception from './exception'

var tmpDir, deferred, Unarchiver


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
		progress, name

	try{


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
				url:'http://bit.ly/2mTM3nY',
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
			plugins: [Unarchiver.decompress_unzip, Unarchiver.decompress_tar]
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


		if(!config.paramfile){
			throw Exception.create("Cannot find an appdmg.json file").putCode("INVALID_CONFIG")
		}

		// make the DMG
		name= Path.basename(config.appfile || "generated." + uniqid(), '.app') + ".dmg"
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
			result: progress,
			url: "download/" + name
		})

	}
	catch(e){
		env.reply.code(500).send({
			error:{
				message: e.message,
				code: e.code
			}
		})
	}
	finally{
		if(folderout && fs.existsSync(folderout)){
			// RMDIR
			await fsextra.remove(folderout)
		}
	}
}
