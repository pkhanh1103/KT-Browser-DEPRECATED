const {
    remote,
    ipcMain,
    clipboard
} = require('electron')
const {
    Menu,
    MenuItem,
    globalShortcut
} = remote
const {
    app
} = require('electron').remote;
var getPixels = require("get-pixels")
var fs = require('fs');
const settings = require('electron-settings');
const isDev = require('electron-is-dev');
var IsThere = require("is-there");
var dir = require('node-dir');
var os = require('os');
var fileToStart = remote.getGlobal("startArgs").data[2]
var historyPath = app.getPath('userData') + '/User Data/History';
var userdataPath = app.getPath('userData') + '/User Data';

$(document).ready(function () {

    Toast_Material({
        content: "Chào mừng bạn đến với bản thử nghiệm KT Browser 7.0 :)",
        updown: "bottom",
        position: "center",
        align: "center"
    });
    var tab = new Tab(),
        instance = $('#instances').browser({
            tab: tab,
            url: settings.get("settings.homePage", "kt-browser://newtab")
        })
    addTab(instance, tab);

    $('.maindiv').msgBox({
        title: 'Thông báo',
        message: 'Đây là phiên bản thử nghiệm của trình duyệt KT Browser 7.0. Xin hãy lưu ý rằng nó rất sơ khai và có rất nhiều tính năng cũng như lỗi vẫn chưa được hoàn thiện và sửa chữa!',
        buttons: [{
            text: 'Tôi hiểu!',
            callback: function () {
                $('p').fadeIn()
                $('.maindiv').msgBox({
                    title: 'This version(Build 18.Apr.17):',
                    message: 'Plugins(ex: Flash Player, QuickTime), Bookmarks and more are not fully working yet! MỚI: Cena, Google API, Night Mode đã hoạt động!',
                    buttons: [{
                        text: 'OK',
                        callback: function () {
                            $('p').fadeIn()
                        }
                    }],
                    blend: !0
                });
            }
        }],
        blend: !0
    });

    globalShortcut.register('CmdOrCtrl+T', () => {
        if (remote.getCurrentWindow().isFocused())
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: settings.get("settings.homePage", "kt-browser://newtab")
                })
        addTab(instance, tab);
    });
    globalShortcut.register('F11', () => {
        if (remote.getCurrentWindow().isFullScreen()) {
            remote.getCurrentWindow().setFullScreen(false);
        } else {
            remote.getCurrentWindow().setFullScreen(true);
        }
    });

    globalShortcut.register('Esc', () => {
        if (remote.getCurrentWindow().isFullScreen()) {
            remote.getCurrentWindow().setFullScreen(false);
        }
    });

    globalShortcut.register('CmdOrCtrl+W', () => {
        if (remote.getCurrentWindow().isFocused()) {
            for (var i = 0; i < tabCollection.length; i++) {
                if (tabCollection[i].selected) {
                    tabCollection[i].closeBtn.click();
                }
            }
        }
    });
    globalShortcut.register('CmdOrCtrl+F4', () => {
        if (remote.getCurrentWindow().isFocused()) {
            for (var i = 0; i < tabCollection.length; i++) {
                if (tabCollection[i].selected) {
                    tabCollection[i].closeBtn.click();
                }
            }
        }
    });
    globalShortcut.register('CmdOrCtrl+Shift+W', () => {
        if (remote.getCurrentWindow().isFocused()) {
            for (var i = 0; i < tabCollection.length; i++) {
                tabCollection[i].closeBtn.click();
            }
        }
    });
    globalShortcut.register('CmdOrCtrl+H', () => {
        if (remote.getCurrentWindow().isFocused())
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: 'kt-browser://history/'
                })
        addTab(instance, tab);
    });
    globalShortcut.register('CmdOrCtrl+T', () => {
        if (remote.getCurrentWindow().isFocused())
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: settings.get("settings.homePage", "kt-browser://newtab")
                })
        addTab(instance, tab);
    });
    globalShortcut.register('CmdOrCtrl+Shift+T', () => {
        if (remote.getCurrentWindow().isFocused())
            Toast_Material({
                content: "Chưa hoàn thiện!",
                updown: "bottom",
                position: "center",
                align: "center"
            });
    });


    document.addEventListener("contextmenu", function (e) {
        if (e.target.localName.trim() === "input") {
            const template = [{
                label: 'Hoàn tác',
                role: 'undo'
            }, {
                label: 'Làm lại',
                role: 'redo'
            }, {
                type: 'separator'
            }, {
                label: 'Cắt',
                role: 'cut'
            }, {
                label: 'Sao chép',
                role: 'copy'
            }, {
                label: 'Dán',
                role: 'paste'
            }, {
                type: 'separator'
            }, {
                label: 'Chọn tất cả',
                role: 'selectall'
            }];
            const menu = Menu.buildFromTemplate(template)
            menu.popup(remote.getCurrentWindow())
        }
    });
    setInterval(function () {
        if (colorBrightness($(document.body).css('background-color')) < 150) {
            for (var i = 0; i < tabCollection.length; i++) {
                tabCollection[i].Title.css('color', '#fff')
                tabCollection[i].Preloader.attr('color', '#fff')
                tabCollection[i].closeBtn.css('color', '#fff')
            }
        } else {
            for (var i = 0; i < tabCollection.length; i++) {
                tabCollection[i].Title.css('color', '#444')
                tabCollection[i].Preloader.attr('color', '#3F51B5')
                tabCollection[i].closeBtn.css('color', '#000')
            }
        }
    }, 200);
});
window.onresize = function (event) {
    calcSizes(false, false);
};

$('.windowbutton-close').click(function () {
    remote.getCurrentWindow().close();
});
$('.windowbutton-maximize').click(function () {
    if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
    } else {
        remote.getCurrentWindow().maximize();
    }
});
$('.windowbutton-minimize').click(function () {
    remote.getCurrentWindow().minimize();
});

function showApp(url) {
    const BrowserWindow = remote.BrowserWindow;

    var mainWindow = new BrowserWindow({
        title: 'KT Browser - Ứng dụng thử nghiệm',
        frame: false
    })

    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadURL(url)
}

function showWebApp(url) {
    const BrowserWindow = remote.BrowserWindow;

    var mainWindow = new BrowserWindow({
        title: 'KT Browser - Ứng dụng thử nghiệm',
        frame: false,
        "web-preferences": {
            "web-security": false,
            nodeIntegration: true,
            allowRunningInsecureContent: true
        }
    })

    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.loadURL('kt-browser://window')
    mainWindow.webContents.executeJavaScript("loadPages('" + url + "')")
}

function checkFiles() {
    if (!IsThere(userdataPath)) {
        fs.mkdir(userdataPath);
    }
    if (!IsThere(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
    }
}

window.getNightMode = function () {
    return settings.get('static.NightMode');
}

function setNightMode(value) {
    settings.set('static.NightMode', value);
}

function getSettings(setting, defaultvalue) {
    return settings.get(setting, defaultvalue);
}

function updatetextColor() {
    if (colorBrightness($(document.body).css('background-color')) < 150) {
        for (var i = 0; i < tabCollection.length; i++) {
            tabCollection[i].Title.css('color', '#fff')
            tabCollection[i].Preloader.attr('color', '#fff')
            tabCollection[i].closeBtn.css('color', '#fff')
        }
    } else {
        for (var i = 0; i < tabCollection.length; i++) {
            tabCollection[i].Title.css('color', '#444')
            tabCollection[i].Preloader.attr('color', '#3F51B5')
            tabCollection[i].closeBtn.css('color', '#000')
        }
    }
}

function updateColor() {
    for (var i = 0; i < tabCollection.length; i++) {
        if (tabCollection[i].selected) {
            if (tabCollection[i].Color != document.body.style.background) {
                a = shadeColor2(tabCollection[i].Color, -0.2)
                setColor(tabCollection[i].Color)
                titlebar.style.background = a;
            }
        }
    }
    updatetextColor()
}

function setColor(color) {
    $(document.body).css('background-color', color)
    if (colorBrightness(color) < 150) {
        $(document.body).find(".windowbutton-close").css('background-image', 'url(img/WindowButtons/close-white.png)')
        $(document.body).find(".windowbutton-minimize").css('background-image', 'url(img/WindowButtons/minimize-white.png)')
        $(document.body).find(".windowbutton-maximize").css('background-image', 'url(img/WindowButtons/maximize-white.png)')
        $(document.body).find(".windowbutton-extensions").css('background-image', 'url(img/apps-white.png)')
        $(document.body).find(".addTabBtn").css('color', '#fff')
    } else {
        $(document.body).find(".windowbutton-close").css('background-image', 'url(img/WindowButtons/close.png)')
        $(document.body).find(".windowbutton-minimize").css('background-image', 'url(img/WindowButtons/minimize.png)')
        $(document.body).find(".windowbutton-maximize").css('background-image', 'url(img/WindowButtons/maximize.png)')
        $(document.body).find(".windowbutton-extensions").css('background-image', 'url(img/apps-black.png)')
        $(document.body).find(".addTabBtn").css('color', '#444')
    }
    for (var i = 0; i < tabCollection.length; i++) {
        if (Foreground == "#fff") {
            borderColor = "rgba(255,255,255,0.2)";
            tabCollection[i].Tab.css('border-left', '1px solid rgba(255,255,255,0.1)')
            tabCollection[i].Tab.css('border-right', '1px solid rgba(255,255,255,0.1)')
            tabCollection[i].Tab.css('border-bottom', '1px solid rgba(255,255,255,0.1)')
            $('.border5').css('background-color', 'rgba(255,255,255,0.1)');
        } else {
            borderColor = "rgba(0,0,0,0.2)";
            tabCollection[i].Tab.css('border-left', '1px solid rgba(0,0,0,0.1)')
            tabCollection[i].Tab.css('border-right', '1px solid rgba(0,0,0,0.1)')
            tabCollection[i].Tab.css('border-bottom', '1px solid rgba(0,0,0,0.1)')
            $('.border5').css('background-color', 'rgba(0,0,0,0.1)');
        }

        if (!tabCollection[i].selected) {
            normalColor = color
            tabCollection[i].Tab.css('background-color', normalColor)
            if (Foreground == "#fff") {
                tabCollection[i].closeBtn.find('.closeBtnImg').css('background-image', 'url("img/close-white.png")')
            } else {
                tabCollection[i].closeBtn.find('.closeBtnImg').css('background-image', 'url("img/close.png")')
            }
            tabCollection[i].Title.css('color', Foreground)
        }
    }
}

globalShortcut.unregisterAll();