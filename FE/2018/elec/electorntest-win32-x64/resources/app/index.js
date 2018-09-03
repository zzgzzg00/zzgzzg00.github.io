﻿const {app, BrowserWindow,net,ipcMain,session,autoUpdater} = require('electron');

const appVersion = require('./package.json').version;
const os = require('os').platform();
const updateFeed = 'http://zzg.com:8081/update.json';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        fullscreen:false,
        webSecurity:false,
        frame:false,
        simpleFullscreen:true,
        webPreferences:{
            nodeIntegration:true,
            session:true,
            webSecurity:false
        }
    })

    // 然后加载应用的 index.html。
    // win.loadFile('index.html')
    win.loadURL('https://zzgzzg00.github.io/FE/2018/elec/electest.html',{
        disablewebsecurity:true,
        nodeintegration:true,
        httpreferrer:"http://cheng.guru"
    });

    // 打开开发者工具
    win.webContents.openDevTools();
        // const request = net.request('https://touch.train.qunar.com')
    // request.on('response', (response) => {
    //     console.log(`STATUS: ${response.statusCode}`)
    //     console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    //     response.on('data', (chunk) => {
    //         console.log(`BODY: ${chunk}`)
    //     })
    //     response.on('end', () => {
    //         console.log('response请求中没有更多数据。')
    //     })
    // })
    // request.end()

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })
    ipcMain.on('asynchronous-message', (event, arg) => {
        console.log(arg) // prints "ping"
        event.sender.send('asynchronous-reply', 'pong')
    })
    ipcMain.on('asynchronous-execcommand', (event, arg) => {
        const exec=new Function('require,win,webContents',arg);
        console.log(11,event.sender);
        exec(require,win,win.webContents);
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
})