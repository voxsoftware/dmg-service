init()
async function init(){
	try{
		if(!process.env.DHS_CONFIG){
			process.env.DHS_CONFIG= module.realPathResolve('main.config.cson')
		}

		await KModule.import("https://kwx.kodhe.com/x/v/0.3.1/dhs/start.js")
	}catch(e){
		console.error("ERROR: ", e)
		process.exit(1)
	}
}
