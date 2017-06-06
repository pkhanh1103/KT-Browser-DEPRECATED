const electron = require('electron')
const protocol = electron.protocol
const app = electron.app
const {ipcMain} = require('electron');
const path = require('path')
var fs = require('fs');
const isDev = require('electron-is-dev');
const BrowserWindow = electron.BrowserWindow
const settings = require('electron-settings');
var remote = require('electron').remote
const windowStateKeeper = require('electron-window-state')
global.startArgs = {
    data: process.argv
}

if (!settings.get("settings.hardalc"))
{
    //this feature need to restart browser
    app.disableHardwareAcceleration();
}

process.env.GOOGLE_API_KEY = 'AIzaSyDwr302FpOSkGRpLlUpPThNTDPbXcIn_FM'
process.env.GOOGLE_DEFAULT_CLIENT_ID = '413772536636.apps.googleusercontent.com'
process.env.GOOGLE_DEFAULT_CLIENT_SECRET = '0ZChLK6AxeA3Isu96MkwqDR4'

if (process.platform == 'win32') {
    app.setPath("appData", path.join(process.env.LOCALAPPDATA, "KT Browser"));
    app.setPath("userData", path.join(process.env.LOCALAPPDATA, "KT Browser"));
    if (!fs.existsSync(settings.file())) {
        fs.mkdir(path.join(process.env.APPDATA, "KT-Browser"));
        fs.writeFile(settings.file(), "", (err) => {});
    }
}

if (!settings.get("static") == null) {
    settings.set('static', {
        NightMode: false
    })
}

if (!settings.has('settings.nvProxy')) {
    settings.set('settings.nvProxy', 'http://kt-browser.com/no-ads.pac');
}

if (!settings.has('settings.homePage')) {
    settings.set('settings.homePage', 'kt-browser://newtab');
}

if (!settings.has('settings.SearchEngine')) {
    settings.set('settings.SearchEngine', '1');
}

if (!settings.has('settings.colorByPage')) {
    settings.set('settings.colorByPage', true);
}

if (!settings.has('settings.labanDic')) {
    settings.set('settings.labanDic', true);
}

if (!settings.has('settings.macRender')) {
    settings.set('settings.macRender', false);
}

if (!settings.has('settings.hardalc')) {
    settings.set('settings.hardalc', true);
}

if (!settings.has('static.NightMode')) {
    settings.set('static.NightMode', false);
}

//let pluginName
//switch (process.platform) {
//    case 'win32':
//        pluginName = 'pepflashplayer.dll'
//        break
//    case 'darwin':
//        pluginName = 'PepperFlashPlayer.plugin'
//        break
//    case 'linux':
//        pluginName = 'libpepflashplayer.so'
//        break
//}
//app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))

// noop ( ͡° ͜ʖ ͡°)

app.commandLine.appendSwitch('enable-smooth-scrolling', '')

let mainWindow

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1024,
        defaultHeight: 768
    })
    mainWindow = new BrowserWindow({
        title: 'KT Browser',
        'minWidth': 640,
        'minHeight': 480,
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        backgroundColor: '#2196F3',
        icon: 'file://${__dirname}/icon.ico',
        frame: false,
        fullscreen: false,
        webPreferences: {
            plugins: true,
            webgl: true
        }
    })
    mainWindow.once('ready-to-show', () => {
        mainWindow.fullscreen = false;
    })
    mainWindow.on('enter-html-full-screen', function () {
        mainWindow.webContents.executeJavaScript('Toast_Material({content:"Nhấn F11 để thoát khỏi chế độ toàn màn hình",updown:"bottom",position:"center",align:"center"});', true)
        mainWindow.webContents.executeJavaScript("titlebar.style.display='none';", true)
    });
    mainWindow.on('leave-html-full-screen', function () {
        mainWindow.webContents.executeJavaScript('Toast_Material({ content : "Đã thoát khỏi chế độ toàn màn hình", updown:"bottom", position:"center", align:"center" });', true)
        mainWindow.webContents.executeJavaScript("titlebar.style.display='block';", true)
    });
    mainWindow.on('enter-full-screen', function () {
        if (process.platform !== 'linux') {
            mainWindow.webContents.executeJavaScript('Toast_Material({ content : "Nhấn F11 để thoát khỏi chế độ toàn màn hình", updown:"bottom", position:"center", align:"center" });', true)
        }
        mainWindow.webContents.executeJavaScript("titlebar.style.display='none';", true)
    });
    mainWindow.on('leave-full-screen', function () {
        if (process.platform !== 'linux') {
            mainWindow.webContents.executeJavaScript('Toast_Material({content:"Đã thoát khỏi chế độ toàn màn hình",updown:"bottom",position:"center",align:"center"});', true)
        }
        mainWindow.webContents.executeJavaScript("titlebar.style.display='block';", true)
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`)
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })
    mainWindow.setMenu(null)
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        //  item.setSavePath(item.getFilename()) //TODO set path to downloads folder
    })
    mainWindowState.manage(mainWindow)
}
process.on('uncaughtException', function (error) {

})
app.commandLine.appendSwitch('enable-pdf-material-ui', '')
app.commandLine.appendSwitch('enable-media-stream', '')
app.commandLine.appendSwitch('enable-speech-input', '')
app.commandLine.appendSwitch('enable-fast-unload', '')
app.commandLine.appendSwitch('smooth-scrolling', 'enabled')
app.commandLine.appendSwitch('touch-events', 'enabled')

protocol.registerStandardSchemes(['kt-browser'])
app.on('ready', function () {
    protocol.registerFileProtocol('kt-browser', (request, callback) => {
        var url = request.url.substr(13)
        var lastChar = url.substr(url.length - 1)
        var s = url.split("/");
        if (lastChar != "/") {
            url = url.replace(s[0], "")
        }
        if (lastChar == "/") {
            url = url.substring(0, url.length - 1)
            url += ".html"
        }
        callback({
            path: path.normalize(`${__dirname}/${url}`)
        })
    }, (error) => {
        return false
    })
    createWindow();
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
app.setName('KT Browser')

var client = require('electron-connect').client;
client.create(mainWindow);
global.sharedObj = {
    prop1: "siema"
};