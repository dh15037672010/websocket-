/**
 * 聊天室主要功能的实现
 */

 // 1.连接socketio服务
 var socket = io('http://localhost:3000')
 var userName,avatar
 // 2.登录功能： 头像选择
$('#login_avatar li').on('click',function(){
    $(this).addClass('now').siblings().removeClass('now')
})

// 3.登录功能：点击登录按钮，提交头像和名称到服务器，并进入聊天室。
$('#loginBtn').on('click',function(){
    var userName = document.getElementById('username').value; 
    // 另一种获取用户名写法：let user = $('#username').val().trim() 
    if (!userName){
        alert('请输入用户名')
        return
    }
    // 获取选择的头像
    var avatar = $('.avatar li.now img').attr('src')
    console.log(userName,avatar)
    // 告诉socketio服务，登录事件，服务器判断是否可以登录并返回结果
    socket.emit('login',{userName:userName,avatar:avatar})
    //注册登录成功失败的事件
    socket.on('login_error',data => {
        alert('登录失败')
    })
    socket.on('login_success',data => {
        alert('登录成功')
        console.log(data)
        //登录框消失，聊天框显示
        $('.login_box').fadeOut()
        $('.container').fadeIn()
        $('#avatar-url').attr('src',data.avatar)
        $('.info .username').text(data.userName)

        window.userName = data.userName
        window.avatar = data.avatar
    })
})

//监听广播消息：有人登录事件
socket.on('addUser',data => {
    //添加一条系统消息
    $('.box-bd').append(
        `<div class="system">
        <p class="message_system">
          <span class="content">${data.userName}加入了群聊</span>
        </p>
      </div>`
    )
    scrollIntoView()
})

//监听用户列表数据：有人登录/退出时。users会变，列表也要跟着变。
//遍历users中的数据，把每个数据都渲染到客户端左侧列表
socket.on('userList',data => {
    console.log(data)
    $('.user-list ul').html('')
    data.forEach(element => {
        $('.user-list ul').append(`
        <li class="user">
        <div class="avatar"><img src=${element.avatar} alt=""></div>
        <div class="name">${element.userName}</div>
      </li>`)
    });
    $('#userTotalNumber').text(data.length)
})

//监听用户断开连接的消息
socket.on('delUser',data => {
    $('.box-bd').append(
        `<div class="system">
        <p class="message_system">
          <span class="content">${data.userName}离开了了群聊</span>
        </p>
      </div>`)
    scrollIntoView()
})


//聊天功能
$('.btn-send').on('click',function(){
    let content = $('#content').val().trim();
    $('#content').val('')
    if(!content){return alert("请输入内容")}
    //先发给服务器，服务器在统一发给所有人。要附上发送者用户名+头像
    var userName = window.userName
    var avatar = window.avatar
    var data = {
        msg:content,
        userName:userName,
        avatar: avatar}
    socket.emit('sendMsg',data)
})
socket.on('receiveMsg',data => {
    console.log(data)
    if (userName === data.userName){
        $('.box-bd').append(`
        <div class="message-box">
            <div class="my message">
                <img src=${data.avatar} alt="" class="avatar">
                <div class="content">
                <div class="bubble">
                    <div class="bubble_cont">${data.msg}</div>
                </div>
                </div>
            </div>
        </div>
        `)
    }else{
        $('.box-bd').append(`
        <div class="message-box">
            <div class="other message">
            <img src=${data.avatar} alt="" class="avatar">
            <div class="content">
                <div class="nickname">${data.userName}</div>
                <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
                </div>
            </div>
            </div>
      </div>`)
    }
    scrollIntoView()
})
function scrollIntoView(){
    //当前聊天信息底部滚到可视区
    $('.box-bd').children(':last').get(0).scrollIntoView(false)}

$('#file').on('change',function(){
    var file = this.files[0]
    //把该文件发到服务器，服务器再接着发给每个连接的用户。借助fileReader
    var fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = function(){
        console.log(fr.result)
        socket.emit('sendImage',{
            userName:window.userName,
            avatar:window.avatar,
            img:fr.result
        })
    }
})
//监听图片聊天信息
socket.on('receiveImage',data => {
    if (userName === data.userName){
        $('.box-bd').append(`
        <div class="message-box">
            <div class="my message">
                <img src=${data.avatar} alt="" class="avatar">
                <div class="content">
                <div class="bubble">
                    <div class="bubble_cont">
                    <img src=${data.img}></div>
                </div>
                </div>
            </div>
        </div>
        `)
    }else{
        $('.box-bd').append(`
        <div class="message-box">
            <div class="other message">
            <img src=${data.avatar} alt="" class="avatar">
            <div class="content">
                <div class="nickname">${data.userName}</div>
                <div class="bubble">
                <div class="bubble_cont"><img src=${data.img}></div>
                </div>
            </div>
            </div>
      </div>`)
    }
    scrollIntoView()
})