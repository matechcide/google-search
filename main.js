const express = require('express')
const app = express()
const server = require('http').createServer(app)
const fs = require("fs")
const io = require("socket.io")(server)
global.dir = __dirname

const modules = {}
fs.readdir(__dirname + '/modules', (err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.js')) return
        modules[file.replace(".js", "")] = require(__dirname + `/modules/${file}`)
	})
})

global.functions = {}
fs.readdir(__dirname + '/functions', (err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.js')) return
        global.functions[file.replace(".js", "")] = require(__dirname + `/functions/${file}`)
	})
})

global.json = {}
fs.readdir(__dirname + '/json', (err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.json')) return
        global.json[file.replace(".json", "")] = require(__dirname + `/json/${file}`)
	})
})

app.set('view engine', 'ejs')
app.set('views', global.dir + '/views');
app.use('/public', express.static(global.dir + '/public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}))
app.set('trust proxy', true);

app.use("*", (req, res) => {
    req.baseUrl = req.baseUrl.substring(1).split('/')
    if(req.baseUrl[0] == ""){
        res.redirect("/index" + req.url)
    }
    else if(modules[req.baseUrl[0]] && modules[req.baseUrl[0]].httpAcces(req)){
        modules[req.baseUrl[0]][req.method](req, res)
    }
})

io.on('connection', (socket) => {
    if(socket.handshake.auth.module && modules[socket.handshake.auth.module] && modules[socket.handshake.auth.module].socketAcces(socket.handshake.headers)){
        modules[socket.handshake.auth.module].socket(socket, socket.handshake.auth)
    }
})

server.listen(5080, () => {
    console.log('Serving on port 5080');
})