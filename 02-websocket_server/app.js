// 1. 导入nodejs-websocket包
const ws = require('nodejs-websocket')
const PORT = 3000

// 2.创建一个server服务
//每次只要有用户连接。函数就会被执行，会给当前连接的用户创建一个conn对象
const server = ws.createServer(connect => {
    console.log('有用户连接')
    // 每当接收到用户传递过来的数据，text事件就会被触发，data就是用户传来的
    connect.on('text',data => {
        console.log('接收到了用户数据',data)
        // 给用户一个响应的数据
        connect.send(data.toUpperCase()+"!!!")
        // connect.send(data)
    })
    // 只要websocket连接断开，close事件就会触发 
    connect.on('close',function(code,reason){
        console.log('连接断开了')
    })
    // 防止websocket服务器端报错并停止服务。处理用户的错误信息
    connect.on('error',() => {
        console.log('用户连接异常')
    })
    
})
server.listen(PORT,() => {
    console.log("websocket启动成了，监听"+PORT)
})