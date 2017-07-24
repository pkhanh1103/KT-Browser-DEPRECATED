const electron = require('electron')
const protocol = electron.protocol
const app = electron.app
const {
    dialog,
    shell,
    ipcMain
} = require('electron')
const path = require('path')
var fs = require('fs');
const isDev = require('electron-is-dev');
const BrowserWindow = electron.BrowserWindow
const settings = require('electron-settings');
var Downloader = require('mt-files-downloader');
var remote = require('electron').remote
const windowStateKeeper = require('electron-window-state')
global.startArgs = {
    data: process.argv
}

if (process.platform == 'win32') {
    if (!fs.existsSync(settings.file())) {
        fs.mkdir(path.join(process.env.APPDATA, "KT-Browser"));
        fs.writeFile(settings.file(), "", (err) => {});
    }
}

if (!settings.get("static") == null) {
    settings.set('static', {
        NightMode: false,
        VPN: false
    })
}

if (settings.get('settings.nvProxy') == null) {
    settings.set('settings.nvProxy', 'http://kt-browser.com/Singapore.pac');
}

if (settings.get('settings.homePage') == null) {
    settings.set('settings.homePage', 'kt-browser://newtab');
}

if (settings.get('settings.SearchEngine') == null) {
    settings.set('settings.SearchEngine', '1');
}

if (settings.get('settings.colorByPage') == null) {
    settings.set('settings.colorByPage', true);
}

if (settings.get('settings.blockUnsafeWeb') == null) {
    settings.set('settings.blockUnsafeWeb', true);
}

if (settings.get('settings.DNT') == null) {
    settings.set('settings.DNT', true);
}

if (settings.get('settings.allowScript') == null) {
    settings.set('settings.allowScript', true);
}

if (settings.get('settings.allowImage') == null) {
    settings.set('settings.allowImage', true);
}

if (settings.get('settings.blockads') == null) {
    settings.set('settings.blockads', true);
}

if (settings.get('settings.labanDic') == null) {
    settings.set('settings.labanDic', true);
}

if (settings.get('settings.macRender') == null) {
    settings.set('settings.macRender', false);
}

if (settings.get('settings.hardalc') == null) {
    settings.set('settings.hardalc', true);
}

if (settings.get('settings.closeOnLastTab') == null) {
    settings.set('settings.closeOnLastTab', true);
}

if (settings.get('static.NightMode') == null) {
    settings.set('static.NightMode', false);
}

if (settings.get('static.VPN') == null) {
    settings.set('static.VPN', false);
}

if (!settings.get("settings.hardalc")) {
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
switch (process.platform) {
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
        mainWindow.webContents.executeJavaScript('Toast_Material({content:"Press F11 to exit fullscreen",updown:"bottom",position:"center",align:"center"});', true)
        mainWindow.webContents.executeJavaScript("titlebar.style.display='none';", true)
    });
    mainWindow.on('leave-html-full-screen', function() {
        mainWindow.webContents.executeJavaScript("titlebar.style.display='block';", true)
    });
    mainWindow.on('enter-full-screen', function() {
        if (process.platform !== 'linux') {
            mainWindow.webContents.executeJavaScript('Toast_Material({ content : "Press F11 to exit fullscreen", updown:"bottom", position:"center", align:"center" });', true)
        }
        mainWindow.webContents.executeJavaScript("titlebar.style.display='none';", true)
    });
    mainWindow.on('leave-full-screen', function() {
        mainWindow.webContents.executeJavaScript("titlebar.style.display='block';", true)
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`)
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', function() {
        mainWindow = null
    })
    mainWindow.setMenu(null)
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        var itemName = item.getFilename()
        var itemURL = item.getURL()
        if (item.getMimeType() === 'application/pdf' && itemURL.indexOf('blob:') !== 0) {
            event.preventDefault()
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: 'chrome://pdf-viewer/index.html?src=' + item.getURL()
                })
            addTab(instance, tab);
        } else {
            var itemWindow = new BrowserWindow({
                title: 'Download File',
                frame: false,
                width: 520,
                height: 235,
                minwidth: 520,
                minheight: 235,
                maxWidth: 550,
                maxHeight: 250
            })

            itemWindow.loadURL(`file://${__dirname}/downloads.html`)
            //Disable new downloader cause bugs
            //if (item.getURL().indexOf("googleusercontent") !== -1 || item.getURL().indexOf("dropboxusercontent") !== -1) {
            if (true) {
                var lastByte = 0;
                if (itemURL.length > 56) {
                    itemWindow.webContents.executeJavaScript("DownloadLink.innerText = 'Download Link: " + itemURL.substring(0, 53) + "...'")
                } else {
                    itemWindow.webContents.executeJavaScript("DownloadLink.innerText = 'Download Link: " + itemURL + "'")
                }
                if (itemName.length > 56) {
                    itemWindow.webContents.executeJavaScript("DownloadLink.innerText = 'Download Link: " + itemName.substring(0, 53) + "...'")
                } else {
                    itemWindow.webContents.executeJavaScript("Filename.innerText = 'Filename: " + itemName + "'")
                }
                setInterval(function() {
                    itemWindow.webContents.executeJavaScript('pauseandresume.innerText', true, function(result) {
                        if (item.getState() !== 'completed')
                            {
                        if (result == "RESUME DOWNLOAD" && item.isPaused() == false) {
                            item.pause()
                        }
                        if (result == "PAUSE DOWNLOAD") {
                            if (item.isPaused()) {
                                item.resume()
                            }
                        }
                    }
                    })
                    itemWindow.webContents.executeJavaScript('stop.innerText', true, function(result) {
                                                if (item.getState() !== 'completed')
                            {
                        if (result == "STOPPING DOWNLOAD...") {
                            item.pause()
                            setTimeout(function() {
                                item.cancel()
                            }, 1500);
                            itemWindow.close()
                        }
                            }
                    })
                    itemWindow.webContents.executeJavaScript('openfolder.innerText', true, function(result) {
                            if (result == "OPENING FOLDER") {
                                //FIXME
                                itemWindow.webContents.executeJavaScript('openfolder.innerText = "OPEN FOLDER"')
                                shell.showItemInFolder(item.getSavePath())
                                console.log(item.getSavePath())
                            }
                    })
                }, 100);
                item.on('updated', (event, state) => {
                    if (state === 'interrupted') {
                        itemWindow.webContents.executeJavaScript("Status.innerText = 'Download is interrupted but can be resumed'")
                    } else if (state === 'progressing') {
                        if (item.isPaused()) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download is paused'")
                        } else {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Downloading:'")
                            itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setProgress(" + Math.round((item.getReceivedBytes() * 100) / item.getTotalBytes()) + ")")
                            itemWindow.webContents.executeJavaScript("DownloadSpeed.innerText = 'Download speed: " + Math.round((item.getReceivedBytes() - lastByte) / 1024) + " KB/s'")
                            itemWindow.webContents.executeJavaScript("DownloadETA.innerText = 'Download ETA: N/A'")
                            lastByte = item.getReceivedBytes()
                        }
                    }
                })

                item.once('done', (event, state) => {
                    if (state === 'completed') {
                        itemWindow.webContents.executeJavaScript("Status.innerText = 'Download completed'")
                        itemWindow.webContents.executeJavaScript("document.getElementById('openfolder').disabled = false;")
                        itemWindow.webContents.executeJavaScript("document.getElementById('pauseandresume').disabled = true;")
                        itemWindow.webContents.executeJavaScript("document.getElementById('stop').disabled = true;")
                        itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setProgress(100)")
                    } else {
                        itemWindow.webContents.executeJavaScript("Status.innerText = 'Download failed'")
                    }
                })
            } else {
                event.preventDefault()
                var downloader = new Downloader();

                var fileSavePath = dialog.showSaveDialog(mainWindow, {
                    title: "Save file as...",
                    defaultPath: itemName,
                    filters: [{
                        name: 'All Files',
                        extensions: ['*']
                    }]
                })

                var dl = downloader.download(itemURL, fileSavePath).start();
                dl.on('start', function() {
                    if (itemURL.length > 56) {
                        itemWindow.webContents.executeJavaScript("DownloadLink.innerText = 'Download Link: " + itemURL.substring(0, 53) + "...'")
                    } else {
                        itemWindow.webContents.executeJavaScript("DownloadLink.innerText = 'Download Link: " + itemURL + "'")
                    }
                    if (itemName.length > 56) {
                        itemWindow.webContents.executeJavaScript("DownloadLink.innerText = 'Download Link: " + itemName.substring(0, 53) + "...'")
                    } else {
                        itemWindow.webContents.executeJavaScript("Filename.innerText = 'Filename: " + itemName + "'")
                    }
                    setInterval(function() {
                        itemWindow.webContents.executeJavaScript('pauseandresume.innerText', true, function(result) {
                            if (result == "RESUME DOWNLOAD") {
                                dl.stop()
                            }
                            if (result == "PAUSE DOWNLOAD") {
                                if (dl.status != 1) {
                                    dl.resume()
                                }
                            }
                        })
                        itemWindow.webContents.executeJavaScript('stop.innerText', true, function(result) {
                            if (result == "STOPPING DOWNLOAD...") {
                                dl.destroy()
                                setTimeout(function() {
                                    downloader.removeDownloadByFilePath(dl.filePath)
                                }, 1500);
                                itemWindow.close()
                            }
                        })
                        itemWindow.webContents.executeJavaScript('openfolder.innerText', true, function(result) {
                            if (result == "OPENING FOLDER...") {
                                shell.showItemInFolder(fileSavePath)
                                itemWindow.webContents.executeJavaScript('openfolder.innerText = "OPEN FOLDER"')
                            }
                        })
                    }, 100);
                    var timer = setInterval(function() {
                        if (dl.status == 0) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download not started.'")
                        } else if (dl.status == 1) {
                            var stats = dl.getStats();
                            itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setBuffer(100)")
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Downloading...'")
                            itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setProgress(" + stats.total.completed + ")")
                            itemWindow.webContents.executeJavaScript("DownloadSpeed.innerText = 'Download speed: " + Downloader.Formatters.speed(stats.present.speed) + "'")
                            itemWindow.webContents.executeJavaScript("DownloadETA.innerText = 'Download ETA: " + Downloader.Formatters.remainingTime(stats.future.eta) + "'")
                        } else if (dl.status == 2) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download error... retrying: " + dl.error + "'")
                            itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setProgress(0)")
                            itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setBuffer(0)")
                        } else if (dl.status == 3) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download completed !'")
                            itemWindow.webContents.executeJavaScript("document.getElementById('openfolder').disabled = false;")
                            itemWindow.webContents.executeJavaScript("document.getElementById('pauseandresume').disabled = true;")
                            itemWindow.webContents.executeJavaScript("document.getElementById('stop').disabled = true;")
                            itemWindow.webContents.executeJavaScript("ProgressBar.MaterialProgress.setProgress(100)")
                        } else if (dl.status == -1) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download error: " + dl.error + "'")
                        } else if (dl.status == -2) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download stopped.'")
                        } else if (dl.status == -3) {
                            itemWindow.webContents.executeJavaScript("Status.innerText = 'Download destroyed.'")
                        }

                        if (dl.status === -1 || dl.status === 3 || dl.status === -3) {
                            clearInterval(timer);
                            timer = null;
                        }
                    }, 1000);
                });
            }
        }
    })
    if (settings.get('settings.DNT')) {
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
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', function() {
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