(function($) {
    $.fn.webview = function(params) {
        var settings = $.extend({
                url: "",
                tab: null
            }, params),
            t = this,
            lastUrl = ''
        t.webview = $('<webview class="webview" preload="js/extensions/preload.js" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 KT-Browser/7.0.0.0" autosize="on" blinkfeatures="CSSOMSmoothScroll, CSSCompositing, BackgroundSync, ApplicationCache, AudioVideoTracks, FastMobileScrolling, Media, Notifications, MediaStreamSpeech, ScriptedSpeech, Touch, ScrollCustomization" webpreferences="experimentalCanvasFeatures=1, scrollBounce=1, plugins=1, experimentalFeatures=1, allowDisplayingInsecureContent=1, allowRunningInsecureContent=1" src="about:blank" plugins>').appendTo($(this))[0]
        t.storage = new Storage()
        t.string = "Siema"
        t.contextMenu = new ContextMenu(t.webview)
        t.fitToParent = function() {
            $(t.webview).css({
                width: window.innerWidth,
                height: window.innerHeight - 79
            })
            t.webview.executeJavaScript('isfullscreen()', true, function(result) {
                if (result == true) {
                    $(t.webview).css({
                        width: window.innerWidth,
                        height: window.innerHeight,
                        marginTop: '-48px'
                    })
                    settings.tab.instance.bar.css('display', 'none')
                } else {
                    $(t.webview).css({
                        width: window.innerWidth,
                        height: window.innerHeight - 79,
                        marginTop: '48px'
                    })
                    settings.tab.instance.bar.css('display', 'block')
                }
            })
        }

        t.fitToParent()

        globalShortcut.register('F12', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.inspectElement(0, 0)
        });
        globalShortcut.register('CmdOrCtrl+Shift+I', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.inspectElement(0, 0)
        });
        globalShortcut.register('F5', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.reload()
        });
        globalShortcut.register('CmdOrCtrl+R', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.reload()
        });
        globalShortcut.register('CmdOrCtrl+Shift+R', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.reloadIgnoringCache()
        });
        globalShortcut.register('Shift+F5', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.reloadIgnoringCache()
        });
        globalShortcut.register('Alt+Home', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.loadURL(settings.get("settings.homePage", "kt-browser://newtab"))
        });

        globalShortcut.register('CmdOrCtrl+P', () => {
            if (remote.getCurrentWindow().isFocused())
                t.webview.print({
                    silent: false,
                    printBackground: false
                })
        });
        $(window).resize(function() {
            t.fitToParent()
        })

        this.webview.addEventListener('ipc-message', function(e) {
            if (e.channel == 'clicked') {
                settings.tab.instance.bar.suggestions.css('display', 'none')
                settings.tab.instance.menu.hide()
            }
            if (e.channel == 'status') {
                if (typeof e.args[0] == 'undefined' || !e.args[0] || e.args[0].length === 0 || e.args[0] === "" || !/[^\s]/.test(e.args[0]) || /^\s*$/.test(e.args[0]) || e.args[0].replace(/\s/g, "") === "") {
                    settings.tab.instance.status.css("display", "none")
                } else {
                    if (e.args[0].length > 60) {
                        settings.tab.instance.status.html(e.args[0].substring(0, 59) + "...")
                    } else {
                        settings.tab.instance.status.html(e.args[0]);
                    }
                    settings.tab.instance.status.css("display", "inline")
                }
            }
        })

        //webview ready event
        $(t.webview).ready(function() {
            var ses = t.webview.getWebContents().session

            settings.tab.instance.bar.searchInput.focus()
            settings.tab.Favicon.css('opacity', "0")
            settings.tab.Preloader.css('opacity', "0")

            ses.allowNTLMCredentialsForDomains('*')
            ses.on('will-download', (event, item, webContents) => {})

            /*if (fileToStart != null) {
                url = fileToStart;
                fileToStart = null;
            }*/

            if (settings.url != null || settings.url != "")
                t.webview.loadURL(settings.url)
        });
        //webview newwindow event
        t.webview.addEventListener('new-window', (e) => {
            const protocol = require('url').parse(e.url).protocol
            if (protocol === 'http:' || protocol === 'https:') {
                var tab = new Tab(),
                    instance = $('#instances').browser({
                        tab: tab,
                        url: e.url
                    })
                addTab(instance, tab);
            }
        })

        t.webview.addEventListener('did-frame-finish-load', function(isMainFrame) {
            settings.tab.Favicon.css('opacity', "1");
            settings.tab.Preloader.css('opacity', "0");

            if (lastUrl != t.webview.getURL()) {
                t.storage.saveHistory(t.webview.getTitle(), t.webview.getURL())
                lastUrl = t.webview.getURL()
            }
            if (!t.webview.getURL().startsWith("kt-browser://newtab") && !t.webview.getURL().startsWith("kt-browser://error") && t.webview.getURL() != "about:blank") {
                settings.tab.instance.bar.searchInput.val(t.webview.getURL());
            }
            if (t.webview.canGoBack()) {
                settings.tab.instance.bar.backBtn.enabled = true
            } else {
                settings.tab.instance.bar.backBtn.enabled = false
            }
            if (t.webview.canGoForward()) {
                settings.tab.instance.bar.forwardBtn.enabled = true
            } else {
                settings.tab.instance.bar.forwardBtn.enabled = false
            }
            if (isMainFrame) {
                settings.tab.instance.webview.webview.executeJavaScript('stylishMenu()', false);
                if (t.webview.getURL().includes("facebook")) {
                    settings.tab.instance.webview.webview.executeJavaScript('MDFacebook()', false);
                }
                settings.tab.instance.webview.webview.executeJavaScript('isNightMode()', true, function(result) {
                    if (result == true) {
                        settings.tab.instance.webview.webview.executeJavaScript('NightMode()', false);
                    }
                })
                settings.tab.instance.webview.webview.executeJavaScript('LaBanDic()', true, function(result) {
                    if (result == true) {
                        t.webview.executeJavaScript('var lbplugin_event_opt={"extension_enable":true,"dict_type":1,"dbclk_event":{"trigger":"none","enable":true,"display":1},"select_event":{"trigger":"ctrl","enable":true,"display":1}};function loadScript(t,e){var n=document.createElement("script");n.type="text/javascript",n.readyState?n.onreadystatechange=function(){("loaded"===n.readyState||"complete"===n.readyState)&&(n.onreadystatechange=null,e())}:n.onload=function(){e()},n.src=t,document.getElementsByTagName("head")[0].appendChild(n)}setTimeout(function(){null==document.getElementById("lbdictex_find_popup")&&loadScript("http://stc.laban.vn/dictionary/js/plugin/lbdictplugin.min.js?"+Date.now()%1e4,function(){lbDictPlugin.init(lbplugin_event_opt)})},1e3);', true)
                    }
                })
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("banner300250-L"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("div-banner300250"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("banner-LR"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("aCenter padB2 banner-position"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("ad-div mastad"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
            }
            t.webview.executeJavaScript('try { function a() {return $(document.body).css("background-color")} a() } catch(err) {}', true, function(result) {
                if (result !== null) {
                    if ((result.replace(/^.*,(.+)\)/, '$1') == 0)) {
                        t.webview.executeJavaScript('try {$(document.body).css("background-color", "#fff")} catch(err) {}', true)
                    }
                }
            })
            settings.tab.instance.webview.webview.executeJavaScript('isMacRender()', true, function(result) {
                if (result == true) {
                    settings.tab.instance.webview.webview.executeJavaScript('MacRender()', false);
                }
            })
        });
        t.webview.addEventListener('did-fail-load', function(e) {
            let errorCode = e.errorCode
            let errorDescription = e.errorDescription

            let dir = __dirname
            if (!errorCode == 0)
            settings.tab.instance.status.html(errorDescription + ": " + errorCode);
        })

        t.webview.addEventListener('leave-html-full-screen', function(name, version) {
            t.fitToParent()
        });
        t.webview.addEventListener('enter-html-full-screen', function(name, version) {
            t.fitToParent()
        });

        t.webview.addEventListener('plugin-crashed', function(name, version) {
            remote.getCurrentWindow().webContents.executeJavaScript("$('.maindiv').msgBox({title:'" + "Lỗi Plugin" + "',message:'" + "Plugin " + name + " không phản hồi!" + "',buttons:[{text:'OK',callback:function(){$('p').fadeIn()}}],blend:!0});")
        });
        t.webview.addEventListener('did-start-loading', function() {
            settings.tab.instance.bar.suggestions.css('display', 'none');
            settings.tab.Favicon.css('opacity', "0");
            settings.tab.Preloader.css('opacity', "1");
            settings.tab.instance.webview.webview.executeJavaScript('stylishMenu()', false);
        });
        t.webview.addEventListener('page-title-updated', function(title) {
            settings.tab.Title.html("<p style='display: inline; width:50%;'>" + "&nbsp;&nbsp;" + t.webview.getTitle() + "</p>");
            if (lastUrl != t.webview.getURL()) {
                t.storage.saveHistory(t.webview.getTitle(), t.webview.getURL())
                lastUrl = t.webview.getURL()
            }
            if (!t.webview.getURL().startsWith("kt-browser://newtab") && t.webview.getURL() != "about:blank") {
                settings.tab.instance.bar.searchInput.val(t.webview.getURL());
            }
        });
        t.webview.addEventListener('load-commit', function(url, isMain) {
            settings.tab.instance.bar.suggestions.css('display', 'none');
        });

        t.webview.addEventListener('page-favicon-updated', function(favicon) {
            settings.tab.Favicon.html("<div class='favicon' style='background-image: url(\"" + favicon.favicons[0] + "\");'></div>");
            settings.tab.Favicon.css('opacity', "1");
            settings.tab.Preloader.css('opacity', "0");
        });

        return this
    }
}(jQuery))