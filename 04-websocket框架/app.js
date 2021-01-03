const { Socket } = require('dgram')
// 创建了http服务器，handler是用来处理js请求的
const http = require('http')
var fs = require('fs');
const app = http.createServer()


app.on('request',(req,res) => {
    fs.readFile(__dirname+'/index.html',function(err,data){
        if(err){
            res.writeHead(500)
            return res.end('error loading index.html')
        }
        res.writeHead(200)
        res.end(data)
    })
})

app.listen(3000,() =>{
    console.log('服务器启动成功')
})

//得到SocketIO的对象，app指的是node.js创建的服务器。
const io = require('Socket.io')(app);
//监听了用户连接的事件
io.on('connection',Socket => {
//Socket表示某个用户的连接，以下emit和on是相互的，也就是可以emit的双方可以角色互换。
//socket.emit表示触发某个事件，如果需要给浏览器发数据，需要触发浏览器注册的某个事件。
//socket.on表示注册某个事件，事件名任意。如果我需要获取浏览器的数据，需要注册一个事件，等待浏览器触发。
    console.log('新用户连接了')
    // Socket.emit('send',{hello:'world'})
    // Socket.on('my other event',function(data){
    //     console.log(data)
    // })
    
    Socket.on('ctos',data => {
        console.log(data)
        Socket.emit('stoc',{name:"我服务器接收到消息了，这是给你的"})
    })
    Socket.on('login',data => {
        console.log(data)
    })
})
