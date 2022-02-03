const url = require('url')
const gif = require('gifencoder');
const canvas = require('canvas');
const fs = require("fs")
const path = require('path');

module.exports = {
    GET: (req, res) => {
        if(url.parse(req.url, true).query.recherche){
            if(url.parse(req.url, true).query.recherche.length > 30){
                return
            }
            global.functions.mongodb.findOne("gif",
            {
                id: url.parse(req.url, true).query.recherche
            },{
                projection:{
                    _id: 0
                }
            }).then((rep) => {
                if(!rep || (rep.statut == false && Date.now() - rep.date > 60000)){
                    global.functions.mongodb.insertOne("gif",
                    {
                        id: url.parse(req.url, true).query.recherche,
                        ip: req.ip,
                        date: Date.now(),
                        statut: false
                    }).then(() => {
                        const encoder = new gif(800, 410)
                        const stream = encoder.createReadStream().pipe(fs.createWriteStream(global.dir + "/images/gif/" + url.parse(req.url, true).query.recherche + ".gif"));
                        encoder.start();
                        encoder.setRepeat(0);
                        encoder.setDelay(100); 
                        encoder.setQuality(10);
                        const img = canvas.createCanvas(800, 410);
                        const ctx = img.getContext('2d');
                        (async () => {
                            for(let index = 0; index < 8; index++){
                                ctx.drawImage(await canvas.loadImage(global.dir + "/images/" + index + ".png"), 0, 0, 800, 410)
                                encoder.addFrame(ctx);
                            }
                            return
                        })()
                        .then(async () => {
                            let words = ""
                            for await(const letter of url.parse(req.url, true).query.recherche){
                                ctx.drawImage(await canvas.loadImage(global.dir + "/images/7.png"), 0, 0, 800, 410)
                                words += letter
                                ctx.font = '25px Arial'
                                ctx.fillText(words, 25, 260)
                                encoder.addFrame(ctx);
                            }
                            stream.on('finish',() => {
                                global.functions.mongodb.updateOne("gif",
                                {
                                    id: url.parse(req.url, true).query.recherche
                                }, {
                                    $set: {
                                        statut: true
                                    }
                                }).then(() => {
                                    res.redirect("/index/render.gif" + req.url.substr(1))
                                })
                            })
                            encoder.finish()
                        })
                    })
                }
                else{
                    res.sendFile(global.dir + "/images/gif/" + rep.id + ".gif")
                }
            })
        }
        else{
            res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {arg1: req.baseUrl[0], arg2: req.baseUrl[0]})
        }
        
    },
    POST: (req, res) => {
        switch(req.body.action){
            case "":
                break;
        
            default:
                break;
        }
    },
    httpAcces: (req) => {
        if(req){
            return true
        }
        else{
            return false
        }
        
    },
    socket: (socket, auth) => {

    },
    socketAcces: (headers) => {
        if(headers){
            return true
        }
        else{
            return false
        }
        
    },
}