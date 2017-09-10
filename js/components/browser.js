(function($) {
    $.fn.browser = function(params) {
        var settings = $.extend({
                url: "",
                tab: null
            }, params),
            browser = $('<div class="tabWindow">').appendTo($(this)),
            status = $('<div class="status" unselectable="on" style="cursor: default; -webkit-user-select: none; user-select: none; -o-user-select: none;">').appendTo(browser),
            bar = $('<div class="bar">').appendTo(browser),
            content = $('<div class="content">').appendTo(browser),
            t = this,
            menu = $('<div class="menu" style="z-index: 9999;">').appendTo(content)
        t.menu = menu.menu({
            tab: settings.tab
        })
        const remote = require('electron').remote;
        var window = remote.getCurrentWindow();
        var colorshaded;

        checkFiles()
        settings.tab.tabWindow = browser

        $(settings.tab).on('ready', function(e, tab) {
            settings.tab = tab
            t.webview = content.webview({
                tab: settings.tab,
                url: settings.url
            })
            t.status = status
            t.bar = bar.bar({
                tab: settings.tab
            })

            if (getSettings("settings.colorByPage", true)) {
                t.colors = new Colors(t.webview.webview)
                setInterval(function() {
                    if (settings.tab.selected) {
                        t.colors.getColor(function(data) {
                            if (settings.tab.Color != data.background) {
                                settings.tab.Color = data.background
                                settings.tab.Tab.css('background-color', data.background)
                                colorshaded = shadeColor2(data.background, -0.2)
                                window.webContents.executeJavaScript('titlebar.style.background="' + colorshaded + '"', true);
                                window.webContents.executeJavaScript("setColor('" + colorshaded + "')", true);
                                t.bar.css('background-color', data.background)
                                changeForeground(data.foreground, data.foreground == 'white' ? '#fff' : '#444')
                            }
                        })
                    }
                }, 200)
            }

            function changeForeground(color, ripple) {
                if (settings.tab.selected) {
                    if (color == 'white') {
                        settings.tab.Title.css('color', '#fff')
                        settings.tab.Preloader.attr('color', '#fff')
                    } else if (color == 'black') {
                        settings.tab.Title.css('color', '#444')
                        settings.tab.Preloader.attr('color', '#3F51B5')
                    }
                    settings.tab.closeBtn.css('color', color)
                }

                settings.tab.Foreground = color
                if (color == 'white') {
                    t.bar.searchBox.css({
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: '#fff'
                    })
                    t.bar.searchInput.css('color', '#fff')
                } else if (color == 'black') {
                    t.bar.searchBox.css({
                        backgroundColor: 'white',
                        color: '#212121'
                    })
                    t.bar.searchInput.css('color', '#212121')
                }
                t.bar.refreshBtn.attr('data-ripple-color', ripple).css('color', color)
                t.bar.backBtn.attr('data-ripple-color', ripple).css('color', color)
                t.bar.forwardBtn.attr('data-ripple-color', ripple).css('color', color)
                t.bar.extBtn.attr('data-ripple-color', ripple).css('color', color)
            }
        })


        globalShortcut.register('F10', () => {
            menu.show();
        });
        globalShortcut.register('Alt+F', () => {
            menu.show();
        });
        globalShortcut.register('Alt+E', () => {
            menu.show();
        });
        return this
    }


}(jQuery))