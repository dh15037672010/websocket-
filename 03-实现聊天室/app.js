const ws = require('nodejs-websocket')
const PORT = 3000
// 记录当前连接的总的用户数量
let count = 0   

// connect：每个连接到服务器的用户，都会有一个connect对象
const server = ws.createServer(connect => {
    console.log('产生了新的连接')
    count++
    // connect.userName = "用户"+count
    // 给本连接用户起名字
    connect.userName = `用户${count}`

    //1.告诉所有用户有人加入了聊天室
    broadcast(connect.userName+'加入了聊天室')
    // 接收到了浏览器数据

    connect.on('text',data =>{
        // 2.当我们接收到某个用户的消息时，boardcast给所有用户
        broadcast(data)  
    })
    connect.on('close',data =>{
        console.log('关闭连接了')
        count--
        //3.有人离开时，也要broadcast给所有人  ,也可写成broadcast(`${connect.userName}推出了聊天室`)
        broadcast(connect.userName+'退出了聊天室')
    })
    connect.on('error',data =>{
        console.log('连接异常')
    })
})

server.listen(PORT,() =>{
    console.log('监听端口'+PORT)
})

// 给所有的连接上来的用户发送消息
function broadcast(message){
    server.connections.forEach(e =>{
        e.send(message)
    })
}