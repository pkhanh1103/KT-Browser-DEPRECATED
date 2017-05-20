(function ($) {
    $.fn.menu = function (params) {
        var settings = $.extend({
                tab: null
            }, params),
            t = this

        t.toggled = false
        $(t).css({
            opacity: 0,
            display: 'none'
        })
        t.menuItems = $('<ul class="menu-items" style="z-index: 9999;background-color: #fff;">').appendTo($(t))
        t.newWindow = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.private = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        if (process.platform == 'win32') {
            t.fullscreen = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
            t.fullscreen.append('<i class="material-icons">fullscreen</i>')
            t.fullscreen.append('<p class="menu-text">Toàn màn hình</p>')
        }
        t.history = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.bookmarks = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.downloads = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.settings = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.nightmode = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.devTools = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)
        t.info = $('<li data-ripple-color="#444" class="menu-item ripple">').appendTo(t.menuItems)

        t.settings.append('<i class="material-icons">settings</i>')
        t.settings.append('<p class="menu-text">Cài đặt (đang phát triển)</p>')

        t.history.append('<i class="material-icons">history</i>')
        t.history.append('<p class="menu-text">Lịch sử</p>')

        t.bookmarks.append('<i class="material-icons">collections_bookmark</i>')
        t.bookmarks.append('<p class="menu-text">Dấu trang (chưa h.thiện)</p>')

        t.downloads.append('<i class="material-icons">file_download</i>')
        t.downloads.append('<p class="menu-text">Tải về (chưa hoàn thiện)</p>')

        t.newWindow.append('<i class="material-icons">desktop_windows</i>')
        t.newWindow.append('<p class="menu-text">Cửa sổ mới</p>')

        t.devTools.append('<i class="material-icons">code</i>')
        t.devTools.append('<p class="menu-text">Chế độ nhà phát triển</p>')

        t.nightmode.append('<i class="material-icons">brightness_4</i>')

        if (getNightMode() == true) {
            t.nightmode.append('<p class="menu-text">Tắt chế độ ban đêm</p>')
        } else {
            t.nightmode.append('<p class="menu-text">Chế độ ban đêm</p>')
        }


        t.private.append('<i class="material-icons">vpn_lock</i>')
        t.private.append('<p class="menu-text">Chế độ ẩn danh (chưa ht)</p>')

        t.info.append('<i class="material-icons">info</i>')
        t.info.append('<p class="menu-text">Thông tin KT Browser</p>')

        $(t).find('.menu-item').mousedown(function (e) {
            makeRippleMenuItem(this, e);
        })

        $(window).on('click', function () {
            t.hide()
        })
        t.history.click(function (e) {
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: 'kt-browser://history'
                })
            addTab(instance, tab);
        });

        t.newWindow.click(function (e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                frame: false
            })
            mainWindow.loadURL(`file://${__dirname}/index.html`)

        });
        t.private.click(function (e) {
            Toast_Material({
                content: "Chưa hoàn thiện!",
                updown: "bottom",
                position: "center",
                align: "center"
            });
        });
        t.fullscreen.click(function (e) {
            settings.tab.instance.webview.webview.executeJavaScript('isfullscreen()', true, function (result) {
                if (result == true) {
                    settings.tab.instance.webview.webview.executeJavaScript('setfullscreen(false)', false);
                } else {
                    settings.tab.instance.webview.webview.executeJavaScript('setfullscreen(true)', false);
                }
            })
        });

        t.nightmode.click(function (e) {
            settings.tab.instance.webview.webview.executeJavaScript('isNightMode()', true, function (result) {
                if (result == true) {
                    settings.tab.instance.webview.webview.executeJavaScript('setNightMode(false)', false);
                    settings.tab.instance.webview.webview.reload();
                } else {
                    settings.tab.instance.webview.webview.executeJavaScript('setNightMode(true)', false);
                    settings.tab.instance.webview.webview.executeJavaScript('NightMode()', false);
                }
            })
        });

        t.info.click(function (e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                title: 'KT Browser',
                frame: false
            })
            mainWindow.loadURL(`file://${__dirname}/about.html`)
        });
        t.bookmarks.click(function (e) {
            Toast_Material({
                content: "Chưa hoàn thiện!",
                updown: "bottom",
                position: "center",
                align: "center"
            });
        });
        t.downloads.click(function (e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                title: 'Tải về',
                frame: false
            })
            mainWindow.loadURL(`file://${__dirname}/downloads.html`)

        });
        t.settings.click(function (e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                title: 'Cài đặt',
                frame: false,
                width: 600,
                height: 750
            })

            mainWindow.on('closed', () => {
                mainWindow = null
            })
            mainWindow.loadURL(`file://${__dirname}/settings.html`)
        });
        t.devTools.click(function (e) {
            settings.tab.instance.webview.webview.openDevTools({
                mode: 'right'
            });
        });


        t.show = function () {
            if (getNightMode() == true) {
                t.nightmode.html('')
                t.nightmode.append('<i class="material-icons">wb_sunny</i>')
                t.nightmode.append('<p class="menu-text">Tắt chế độ ban đêm</p>')
            } else {
                t.nightmode.html('')
                t.nightmode.append('<i class="material-icons">brightness_4</i>')
                t.nightmode.append('<p class="menu-text">Chế độ ban đêm</p>')
            }
            //menu fade in animation
            $(t).css('display', 'block');
            $(t).css('opacity', 0).animate({
                opacity: 1
            }, 200, function () {
                t.toggled = true
            }).css('top', -20).animate({
                top: 8
            }, {
                queue: false,
                duration: 100
            });
        }

        t.hide = function () {
            //menu fade out animation
            $(t).css('opacity', 1).animate({
                opacity: 0
            }, 60).css('top', 8).animate({
                top: -20
            }, {
                queue: false,
                complete: function () {
                    $(t).css('display', 'none');
                },
                duration: 100
            });
            t.toggled = false;
        }

        return this
    }

}(jQuery))
