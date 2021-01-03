/**
 * 启动聊天室的服务端程序。
 */
//记录所有已登录用户
const users = [];
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(3000, () => {
    console.log('服务器启动成功：listening on *:3000');
  });

// express处理静态资源,把public目录设置为静态资源目录，这样public就允许你直接访问了。
app.use(require('express').static('public'))

//访问localhost:3000/首页时候,跳到首页。这里的index.html是public下面的
app.get('/', (req, res) => {
    res.redirect('/index.html')
    // res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {   //每个用户都维护一个socket表示该用户
  console.log('a user connected');
  socket.on('login',data => {
    console.log(data)
    let user = users.find(item => item.userName === data.userName )
    if(!user){
      users.push(data)
      socket.emit('login_success',data)
      console.log('登录成功')
      //告诉所有用户，xx加入进聊天室。
      io.emit('addUser',data)
      //告诉所有用户，目录聊天室有多少人，
      io.emit('userList',users)
    }else{
      console.log('登陆失败');
      socket.emit('login_error',{msg:'用户名已存在，登录失败'})}
    //存储这个socket对应的用户名。退出时可以用。
    socket.userName = data.userName  
    socket.avatar = data.avatar
  })

  //用户断开连接功能,自带的事件函数。
  socket.on('disconnect',data => {
    //1.把当前用户信息删除掉，告诉所有人有人离开了聊天室。左侧列表也要更改。
    let idx = users.findIndex(e => socket.userName === e.userName)
    users.splice(idx,1)
    io.emit('delUser',{userName:socket.userName,avatar:socket.avatar})
    io.emit('userList',users) 
  })
  // 接收文字信息
  socket.on('sendMsg',data => {
      console.log(data)
      //广播给所有用户.
      io.emit('receiveMsg',data)
  })

  //接收图片信息
  socket.on('sendImage',data => {
    io.emit('receiveImage',data)
  })

});


