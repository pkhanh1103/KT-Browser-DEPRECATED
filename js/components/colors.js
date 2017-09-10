class Colors {
    constructor(webview) {
        this.webview = webview
    }

    getForegroundColor(color) {
        var brightness = colorBrightness(color)
        if (brightness < 150) {
            return 'white'
        } else {
            return 'black'
        }
    }

    getColorFromTop(callback = null) {
        var t = this
        if (typeof(this.webview) !== "undefined" && this.webview != null && this.webview.getWebContents() != null) {
            t.webview.capturePage({
                x: 1,
                y: 1,
                width: 2,
                height: 2
            }, function(image) {
                require("get-pixels")(image.toDataURL(), function(err, pixels) {
                    if (err) {
                        return
                    }
                    var color = rgbToHex(pixels.data[0], pixels.data[1], pixels.data[2])
                    if (pixels.data[3] == 0) {
                        color = "#fff"
                    }
                    if (typeof(callback) === 'function') {
                        callback({
                            foreground: t.getForegroundColor(color),
                            background: color
                        })
                    }
                })
            });
        }
    }
    getColorFromSource(regexp, result, callback = null) {
        var t = this
        var regex = result.match(regexp).toString();
        var color = regex.match(/content="(.*?)"/)[1];
        if (typeof(callback) === 'function') {
            callback({
                foreground: t.getForegroundColor(color),
                background: color
            })
        }
    }
    getColor(callback = null) {
        var t = this
        if (this.webview != null && this.webview.getWebContents() != null) {
            t.webview.executeJavaScript("function s() {var markup = document.documentElement.innerHTML; return markup} s();", false, function(result) {
                var regexp = /<meta name='?.theme-color'?.*>/;
                if (regexp.test(result)) {
                    if (typeof(callback) === 'function') {
                        t.getColorFromSource(regexp, result, function(color) {
                            callback({
                                foreground: color.foreground,
                                background: color.background
                            })
                        })
                    }
                } else {
                    if (typeof(callback) === 'function') {
                        t.getColorFromTop(function(color) {
                            callback({
                                foreground: color.foreground,
                                background: color.background
                            })
                        })

                    }
                }
            });
        }
    }
}