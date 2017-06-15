const electron = require('electron')
const protocol = electron.protocol
const app = electron.app
const {
    ipcMain
} = require('electron');
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

if(process.platform == 'win32') {
    if(!fs.existsSync(settings.file())) {
        fs.mkdir(path.join(process.env.APPDATA, "KT-Browser"));
        fs.writeFile(settings.file(), "", (err) => {});
    }
}

if(!settings.get("static") == null) {
    settings.set('static', {
        NightMode: false
    })
}

if(settings.get('settings.nvProxy') == null) {
    settings.set('settings.nvProxy', '');
}

if(settings.get('settings.homePage') == null) {
    settings.set('settings.homePage', 'kt-browser://newtab');
}

if(settings.get('settings.SearchEngine') == null) {
    settings.set('settings.SearchEngine', '1');
}

if(settings.get('settings.colorByPage') == null) {
    settings.set('settings.colorByPage', true);
}

if(settings.get('settings.DNT') == null) {
    settings.set('settings.DNT', true);
}

if(settings.get('settings.allowScript') == null) {
    settings.set('settings.allowScript', true);
}

if(settings.get('settings.allowImage') == null) {
    settings.set('settings.allowImage', true);
}

if(settings.get('settings.blockads') == null) {
    settings.set('settings.blockads', true);
}

if(settings.get('settings.labanDic') == null) {
    settings.set('settings.labanDic', true);
}

if(settings.get('settings.macRender') == null) {
    settings.set('settings.macRender', false);
}

if(settings.get('settings.hardalc') == null) {
    settings.set('settings.hardalc', true);
}

if(settings.get('settings.closeOnLastTab') == null) {
    settings.set('settings.closeOnLastTab', true);
}

if(settings.get('static.NightMode') == null) {
    settings.set('static.NightMode', false);
}

if(!settings.get("settings.hardalc")) {
    //this feature need to restart browser
    app.disableHardwareAcceleration();
}

app.commandLine.appendSwitch('enable-pdf-material-ui', '')
app.commandLine.appendSwitch('enable-media-stream', '')
app.commandLine.appendSwitch('enable-speech-input', '')
app.commandLine.appendSwitch('enable-fast-unload', '')
app.commandLine.appendSwitch('smooth-scrolling', 'enabled')
app.commandLine.appendSwitch('touch-events', 'enabled')

process.env.GOOGLE_API_KEY = 'AIzaSyDwr302FpOSkGRpLlUpPThNTDPbXcIn_FM'
process.env.GOOGLE_DEFAULT_CLIENT_ID = '413772536636.apps.googleusercontent.com'
process.env.GOOGLE_DEFAULT_CLIENT_SECRET = '0ZChLK6AxeA3Isu96MkwqDR4'

let pluginName
switch(process.platform) {
    case 'win32':
        pluginName = 'pepflashplayer.dll'
        break
    case 'darwin':
        pluginName = 'PepperFlashPlayer.plugin'
        break
    case 'linux':
        pluginName = 'libpepflashplayer.so'
        break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))

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
        backgroundColor: '#fff',
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
    mainWindow.on('enter-html-full-screen', function() {
        mainWindow.webContents.executeJavaScript('Toast_Material({content:"Nhấn F11 để thoát khỏi chế độ toàn màn hình",updown:"bottom",position:"center",align:"center"});', true)
        mainWindow.webContents.executeJavaScript("titlebar.style.display='none';", true)
    });
    mainWindow.on('leave-html-full-screen', function() {
        mainWindow.webContents.executeJavaScript('Toast_Material({ content : "Đã thoát khỏi chế độ toàn màn hình", updown:"bottom", position:"center", align:"center" });', true)
        mainWindow.webContents.executeJavaScript("titlebar.style.display='block';", true)
    });
    mainWindow.on('enter-full-screen', function() {
        if(process.platform !== 'linux') {
            mainWindow.webContents.executeJavaScript('Toast_Material({ content : "Nhấn F11 để thoát khỏi chế độ toàn màn hình", updown:"bottom", position:"center", align:"center" });', true)
        }
        mainWindow.webContents.executeJavaScript("titlebar.style.display='none';", true)
    });
    mainWindow.on('leave-full-screen', function() {
        if(process.platform !== 'linux') {
            mainWindow.webContents.executeJavaScript('Toast_Material({content:"Đã thoát khỏi chế độ toàn màn hình",updown:"bottom",position:"center",align:"center"});', true)
        }
        mainWindow.webContents.executeJavaScript("titlebar.style.display='block';", true)
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`)
    if(isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', function() {
        mainWindow = null
    })
    mainWindow.setMenu(null)
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        if(item.getMimeType() === 'application/pdf' && itemURL.indexOf('blob:') !== 0) {
            event.preventDefault()
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: 'chrome://pdf-viewer/index.html?src=' + item.getURL()
                })
            addTab(instance, tab);
        }
    })
    if(settings.get('settings.DNT')) {
        const filter = {
            urls: ["http://*/*", "https://*/*"]
        }
        mainWindow.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            details.requestHeaders['DNT'] = "1";
            callback({
                cancel: false,
                requestHeaders: details.requestHeaders
            })
        })
    }
    mainWindowState.manage(mainWindow)
}
process.on('uncaughtException', function(error) {

})

protocol.registerStandardSchemes(['kt-browser'])
app.on('ready', function() {
    protocol.registerFileProtocol('kt-browser', (request, callback) => {
        var url = request.url.substr(13)
        var lastChar = url.substr(url.length - 1)
        var s = url.split("/");
        if(lastChar != "/") {
            url = url.replace(s[0], "")
        }
        if(lastChar == "/") {
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
app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', function() {
    if(mainWindow === null) {
        createWindow()
    }
})
app.setName('KT Browser')

var client = require('electron-connect').client;
client.create(mainWindow);
global.sharedObj = {
    prop1: "siema"
};