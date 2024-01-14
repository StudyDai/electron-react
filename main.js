const { app, BrowserWindow, globalShortcut } = require('electron')
const remote = require('@electron/remote/main')
remote.initialize()
let mainWindow

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true, /* 这个东西设置了,我们上面的在js中使用node环境的能力才会生效 */
            contextIsolation: false /* 这个是上下文隔离代码 */
        }
    })
    mainWindow.webContents.openDevTools()
    const urlLocation = "http://localhost:3000"
    mainWindow.loadURL(urlLocation)
    remote.enable(mainWindow.webContents)
})