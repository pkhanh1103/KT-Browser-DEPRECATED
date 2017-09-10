(function($) {
    $.fn.bar = function(params) {
        var settings = $.extend({
                tab: null
            }, params),
            t = this,
            webview = settings.tab.instance.webview.webview,
            menu = settings.tab.instance.menu

        $(settings.tab).on('ready', function() {
            menu = settings.tab.instance.menu
        })

        this.backBtn = $('<div ondrop="return false;" class="ripple-icon backBtn">').appendTo($(this))
        this.forwardBtn = $('<div ondrop="return false;" class="ripple-icon forwardBtn">').appendTo($(this))
        this.refreshBtn = $('<div ondrop="return false;" class="ripple-icon refreshBtn">').appendTo($(this))
        this.searchBox = $('<div ondrop="return false;" class="searchBox">').appendTo($(this))
        var searchInput = $('<input ondrop="return false;" class="searchInput">').appendTo(this.searchBox)
        this.micBtn = $('<div ondrop="return false;" id="MicCN" class="micBtn">').appendTo($(this.searchBox))
        this.rdBtn = $('<div ondrop="return false;" id="rdCN" class="rdBtn">').appendTo($(this.searchBox))
        this.extBtn = $('<div ondrop="return false;" class="ripple-icon extBtn">').appendTo($(this))
        var suggestions = $('<div ondrop="return false;" class="suggestions">').appendTo($(this))
        this.searchInput = searchInput.searchInput({
            tab: settings.tab
        })
        this.suggestions = suggestions.suggestions({
            tab: settings.tab,
            searchInput: this.searchInput
        })
        var backIcon = $('<i class="material-icons btn-icon" style="font-size: 22px">arrow_back</i>').appendTo(this.backBtn),
            forwardIcon = $('<i class="material-icons btn-icon" style="font-size: 22px">arrow_forward</i>').appendTo(this.forwardBtn),
            refreshIcon = $('<i class="material-icons btn-icon" style="font-size: 22px">refresh</i>').appendTo(this.refreshBtn),
            rdIcon = $('<i class="material-icons" title="Reader View" >chrome_reader_mode</i>').appendTo(this.rdBtn),
            favIcon = $('<i2 class="material-icons" title="Bookmark this page" >favorite_border</i2>').appendTo(this.searchBox),
            micIcon = $('<i3 id="micicon" class="material-icons" title="Search by voice (disabled)" style="font-size: 18px;">mic_none</i3>').appendTo(this.micBtn),
            extIcon = $('<i class="material-icons btn-icon" style="font-size: 22px;">more_vert</i>').appendTo(this.extBtn)

        this.searchIcon = $('<i class="material-icons">search</i>').appendTo(this.searchBox)
        $(".rdIcon").tooltip();
        $(".micIcon").tooltip();
        $(".favIcon").tooltip();

        $('.ripple-icon').mousedown(function() {
            makeRippleIconButton($(this))
        })

        $('.btn-icon').mouseenter(function() {
            makeRippleIconButtonHover($(this).parent())
        })

        this.backBtn.click(function() {
            if (webview.canGoBack()) {
                webview.goBack();
            }
        });
        this.forwardBtn.click(function() {
            if (webview.canGoForward()) {
                webview.goForward();
            }
        });
        this.refreshBtn.click(function() {
            webview.reload();
        });
        this.extBtn.click(function(e) {
            e.stopPropagation()
            if (!menu.toggled) {
                menu.show()
            } else {
                menu.hide()
            }
        });
        this.micBtn.click(function() {
            //recognizer.start();
        });
        this.rdBtn.click(function() {
            const protocol = require('url').parse(webview.getURL()).protocol
            if (protocol === 'http:' || protocol === 'https:') {
                webview.executeJavaScript("document.querySelector('article')", true, function(result) {
                    webview.executeJavaScript('getReaderScore()', true, function(tl) {
                        tl = Math.abs(tl)
                        if (tl > 650 || (result && tl > 200)) {
                            webview.loadURL(`file://${__dirname}/reader/index.html?url=` + webview.getURL())
                        } else {
                            $('.maindiv').msgBox({
                                title: 'Warning',
                                message: "This page might not be compatible with Reader view. Do you want to proceed?",
                                buttons: [{
                                    text: 'No',
                                    callback: function() {
                                        $('p').fadeIn()

                                    }
                                }, {
                                    text: 'Yes, I want to use Reader view',
                                    callback: function() {
                                        $('p').fadeIn()
                                        webview.loadURL(`file://${__dirname}/reader/index.html?url=` + webview.getURL())
                                    }
                                }],
                                blend: !0
                            });
                        }
                    })
                })
            }
        });
        return this
    }

}(jQuery))