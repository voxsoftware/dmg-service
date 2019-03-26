# dmg-service

Webservice for generate good DMG files from an MacOS app. 

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

In the response is returned the relatiev **url** for start download the generated DMG

```http://127.0.0.1:10000/site/dmg-service/dmg/download/Visual Studio Code.app1rw3jf90jtpin4h9.dmg?name=Visual Studio Code.dmg```



### Contribute 

Contributions are welcome. You can report issues, request a feature, or contribute with docs. If you have no time, or not are a developer, you can contribute with money

* Donate to paypal [![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XTUTKMVWCVQCJ&source=url)