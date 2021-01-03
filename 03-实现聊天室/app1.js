const ws = require('nodejs-websocket')
const PORT = 3000
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2
let count = 0   


const server = ws.createServer(connect => {
    console.log('产生了新的连接')
    count++

    connect.userName = `用户${count}`


    broadcast({
        type: TYPE_ENTER,
        message: `用户${count}进入了聊天室`,
        time: new Date().toLocaleTimeString()
    })


    connect.on('text',data =>{
        broadcast({
            type: TYPE_MSG,
            message: data,
            time: new Date().toLocaleTimeString()
        })
    
    })
    connect.on('close',data =>{
        console.log('关闭连接了')
        count--

        broadcast({
            type: TYPE_LEAVE,
            message: `用户${count}离开了聊天室`,
            time: new Date().toLocaleTimeString()
        })
    
    })
    connect.on('error',data =>{
        console.log('连接异常')
    })
})

server.listen(PORT,() =>{
    console.log('监听端口'+PORT)
})

function broadcast(message){
    server.connections.forEach(e =>{
        e.send(JSON.stringify(message))
    })
}