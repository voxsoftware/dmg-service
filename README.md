# dmg-service

Webservice for generate good DMG files from an MacOS app. 

### Test online free 

Here is an url example for generate a DMG based on VsCode app. You can replace the parameter url with your own zipped app: 

```
https://dmg.kodhe.com/create?url=https://az764295.vo.msecnd.net/stable/a3db5be9b5c6ba46bb7555ec5d60178ecc2eaae4/VSCode-darwin-stable.zip
```

You can also use CURL for send your local zipped app file

```
curl --request POST --data-binary "@/path/to/yourapp.zip" https://dmg.kodhe.com/create
```

The response is a json, with an ```url``` property, for start downloading the ```dmg file```. Scroll down for more info how works. 



### Get started

You have many options for starting. 


1. Using  ```start.js```  for start a standalone kawix/dhs server

```bash 
npm -g install @kawix/core@latest
git clone https://github.com/voxsoftware/dmg-service 
cd dmg-service
kwcore ./start.js
```

2. Using beside more projects (vhosts) on a kawix/dhs server config

```bash 
# you can download the entire kawix project
git clone https://github.com/voxsoftware/kawix
cd kawix
git checkout 0.3.1

# now download this project
cd ..
mkdir hosts 
cd hosts 
git clone https://github.com/voxsoftware/dmg-service 
cd ..
cd kawix/dhs 
# start.clustered.js for start using one process per code, or start.js for a single process
../core/bin/kwcore ./start.clustered.js
```

Now go to your web browser, and test this URL that creates a DMG from VsCode (asumming that your server is running on port 10000): 

```http://127.0.0.1:10000/site/dmg-service/dmg/create?url=https://az764295.vo.msecnd.net/stable/a3db5be9b5c6ba46bb7555ec5d60178ecc2eaae4/VSCode-darwin-stable.zip```

You will get a JSON like this:

```json
{
    "result": [
        {
            "type": "step-begin",
            "title": "Looking for target",
            "current": 1,
            "total": 21
        }, {
            "type": "step-end",
            "status": "ok",
            "current": 1,
            "total": 21
        }, {
            "type": "step-begin",
            "title": "Reading JSON Specification",
            "current": 2,
            "total": 21
        }, {
            "type": "step-end",
            "status": "ok",
            "current": 2,
            "total": 21
        }, {
            "type": "step-begin",
            "title": "Parsing JSON Specification",
            "current": 3,
            "total": 21
        }, {
            "type": "step-end",
            "status": "ok",
            "current": 3,
            "total": 21
        },         
        ...
    ],
    "url": "download/Visual Studio Code.app1rw3jf90jtpin4h9.dmg?name=Visual Studio Code.dmg"
}
```

In the response is returned the relative **url** for start download the generated DMG

```http://127.0.0.1:10000/site/dmg-service/dmg/download/Visual Studio Code.app1rw3jf90jtpin4h9.dmg?name=Visual Studio Code.dmg```


### How works 

* This service takes a compressed MacOs app and creates a DMG. You can optionally customize the DMG, providing a filename named ```appdmg.json``` with a valid configuration. 

* If you want know what are the possible values for configuration, take a look on [appdmg module](https://github.com/LinusU/node-appdmg)

* Your compressed file can be ```.zip``` or ```tar.gz``` 

* If you don't provide a file ```appdmg.json```, this service will create a default, looks like that:

```json
{
    "title": "YOURAPP",
    "contents": [
        { "x": 350, "y": 140, "type": "link", "path": "/Applications" },
        { "x": 150, "y": 140, "type": "file", "path": "./YOURAPP.app"  }
    ],
    "window":{
        "size":{
            "width": 546,
            "height": 326
        }
    }
}
```


### Contribute 

Contributions are welcome. You can report issues, request a feature, or contribute with docs. If you have no time, or not are a developer, you can contribute with money

* Donate to paypal [![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XTUTKMVWCVQCJ&source=url)
