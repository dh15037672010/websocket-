const Socket = new WebSocket('ws://localhost:3000')
Socket.onopen(()=>{
    Socket.send('hello!客户端')
})
Socket.onmessage(data => {
    console.log(data);
})