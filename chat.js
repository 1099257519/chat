const http = require('http');
const io = require('socket.io');
let httpServer = http.createServer((request, response) => {
    console.log('有人执行我了')
    response.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    
        <style>
            *{
                margin: 0;
                padding: 0;
                list-style: none;
                box-sizing: border-box;
            }
            .layout {
                width: 400px;
                margin: 100px auto 0;
            }
            #oUl {
                width: 400px;
                height: 300px;
                border:1px solid #000;
                margin-bottom: 50px;
                padding: 20px;
                overflow: auto;
            }
            #text {
                width: 400px;
                height: 200px;
            }
            .error_box {
                width: 100%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                color:red;
                display: none;
            }
        </style>
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io.connect('ws://www.qwworld.com.cn:8888/')
            window.onload = function() {
                const oUl = document.getElementById('oUl')
                const text = document.getElementById('text')
                const btn1 = document.getElementById('btn1')
                btn1.onclick = function () {
                    socket.emit('message',text.value)                
                    const li = document.createElement('li')
                    li.innerHTML = text.value
                    li.style.color = 'red'
                    oUl.appendChild(li)
                    text.value = ''
                }
                socket.on('message',str => {
                    const li = document.createElement('li')
                    li.innerHTML = str
                    oUl.appendChild(li)
                })
                socket.on('connect', ()=> {
                    document.querySelectorAll('.error_box')[0].style.display = 'none'
                })
                socket.on('disconnect', ()=> {
                    document.querySelectorAll('.error_box')[0].style.display = 'block'
                })
            }
        </script>
    </head>
    <body>
        <div class="layout">
            <div class="error_box">与服务器断开连接,请检查网络</div>
            <ul id="oUl"></ul>
            <textarea name="" id="text" cols="30" rows="10"></textarea>
            <br>
            <input type="button" id="btn1" value="发送">
        </div>
        
    </body>
    </html>`)
    response.end()
});
httpServer.listen(8888)
let aSock = []
let wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {
    aSock.push(sock)
    sock.emit
    sock.on('message', str => {
        aSock.forEach(s => {
            if (s != sock) {
                s.emit('message', str)
            }
        })
    })
    sock.on('disconnect', sock => {
        const index = aSock.indexOf(sock)
        aSock.splice(index, 1)
    })
})