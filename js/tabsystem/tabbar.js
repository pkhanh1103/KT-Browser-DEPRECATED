var tabCollection = [];
var tabWidth = 190;
var tabHeight = 32;
var selectedTabColor = '#fff';
var locked = false;
var cursorX;
var cursorY;
var normalColor = '#eee';
var Foreground = '#444';
var borderColor = 'rgba(0,0,0,0.1)';

function addTab(instance, tab) {
    tab.Tab = $('<div class="tab" id="#tab"></div>').appendTo('#tabbar');
    tab.closeBtn = $("<div class='closeBtn' data-tooltip-text='Close tab (Ctrl + W)' data-tooltip-position='bottom' ><i class='material-icons' style='font-size: 18px;'>close</i></div>").appendTo(tab.Tab);
    tab.Title = $("<div class='tabTitle'>New tab</div>").appendTo(tab.Tab);
    tab.Favicon = $("<div></div>").appendTo(tab.Tab);
    tab.Foreground = 'black';
    tab.Color = selectedTabColor;
    tab.instance = instance;

    tab.Preloader = $('<div class="preloader" style="height: 16px;width: 16px;position:absolute; top: 6px; left:6px;" thickness="9" color="#3F51B5"></div>').appendTo(tab.Tab);
    tab.Preloader.preloader()
    tab.selected = false;
    tab.getColor = function() {
        return tab.Tab.css('background-color')
    }

    tab.Tab.contextmenu(function(e) {
        const menu = new Menu()
        menu.append(new MenuItem({
            label: 'New tab',
            accelerator: 'CmdOrCtrl+N',
            click() {
                var tab = new Tab(),
                    instance = $('#instances').browser({
                        tab: tab,
                        url: settings.get("settings.homePage", "kt-browser://newtab")
                    })
                addTab(instance, tab);
            }
        }))
        menu.append(new MenuItem({
            type: 'separator'
        }))
        menu.append(new MenuItem({
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click() {
                tab.instance.webview.webview.reload()
            }
        }))
        menu.append(new MenuItem({
            label: 'Reload (ignore cache)',
            accelerator: 'CmdOrCtrl+Shift+R',
            click() {
                tab.instance.webview.webview.reloadIgnoringCache()
            }
        }))
        menu.append(new MenuItem({
            label: 'Pin tab',
            enabled: false,
            click() {}
        }))
        if(tab.instance.webview.webview.isAudioMuted()) {
            menu.append(new MenuItem({
                label: 'Unmute tab',
                click() {
                    tab.instance.webview.webview.setAudioMuted(false)
                }
            }))
        } else {
            menu.append(new MenuItem({
                label: 'Mute tab',
                click() {
                    tab.instance.webview.webview.setAudioMuted(true)
                }
            }))
        }
        menu.append(new MenuItem({
            type: 'separator'
        }))

        menu.append(new MenuItem({
            label: 'Close tab',
            accelerator: 'CmdOrCtrl+W',
            click() {
                removeTab(tab);
            }
        }))
        menu.popup(remote.getCurrentWindow())
    });

    $(".closeBtn").tooltip();

    tab.closeBtn.click(function(e) {
        removeTab(tab);
    });

    tab.Tab.draggable({
        containment: "parent",
        axis: 'x',
        stop: function(event, ui) {
            calcSizes(true, true);
        },
        drag: function(event, ui) {
            for(var i = 0; i < tabCollection.length; i++) {
                tabCollection[i].Tab.css('z-index', 1);

            }
            tab.Tab.css('z-index', 9999);
            var overTab = getTabFromMousePoint(tab);
            if(overTab != null) {
                var indexTab = tabCollection.indexOf(tab);
                var indexOverTab = tabCollection.indexOf(overTab);
                tabCollection[indexTab] = overTab;
                tabCollection[indexOverTab] = tab;
                overTab.Tab.stop();
                changePos(overTab);
            }
        }
    });
    $('#addTab').insertAfter(tab.Tab);
    tabCollection.push(tab);
    selectTab(tab.Tab);
    tab.selected = true;
    tab.Tab.mousedown(function(e) {
        selectTab(tab.Tab);
    });
    calcSizes(false, true);
    tab.Tab.css({
        top: 50
    });
    tab.Tab.animate({
        top: 0
    }, {
        duration: 175
    });
    setInterval(function() {
        if(tabCollection.indexOf(tab) == 0) {
            tab.Tab.css('border-left', 'none');
        } else {
            tab.Tab.css('border-left', '1px solid ' + borderColor);
        }
    }, 1)
    tab.Tab.mouseenter(function() {
        var color = tab.Color;

        if(color.startsWith('#')) {
            color = hexToRgb(tab.Color);
            var r = color.r;
            var g = color.g;
            var b = color.b;
            if(!tab.selected)
                tab.Tab.animate({
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`
                }, {
                    duration: 20,
                    queue: false
                })
        } else {
            var rgb = getRGB(color)
            var r = rgb.r
            var g = rgb.g
            var b = rgb.b
            if(!tab.selected)
                tab.Tab.animate({
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`
                }, {
                    duration: 20,
                    queue: false
                })
        }
    })
    tab.Tab.mouseleave(function() {
        if(!tab.selected)
            tab.Tab.animate({
                backgroundColor: normalColor
            }, {
                duration: 20,
                queue: false
            })
    })
    $(tab).triggerHandler('ready', tab)
}

function removeTab(tab) {
    if (tab.instance.webview.isPrivacy)
    {
        tab.instance.webview.webview.getWebContents().clearHistory()
        tab.instance.webview.webview.getWebContents().session.clearCache(function() {console.log('cleaned cache...')})
        tab.instance.webview.webview.getWebContents().session.clearStorageData()
        tab.instance.webview.webview.getWebContents().session.flushStorageData()
        console.log('clear data...')
        tab.instance.webview.webview.getWebContents().session.cookies.flushStore(function() {console.log('cleaned cookies...')})
    }
    tab.tabWindow.remove();
    if(tabCollection.indexOf(tab) - 1 != -1) {
        selectTab(tabCollection[tabCollection.indexOf(tab) - 1].Tab);
    } else {
        if(tabCollection[1] != null)
            selectTab(tabCollection[1].Tab);
    }

    tabCollection.splice(tabCollection.indexOf(tab), 1);
    tab.Tab.animate({
        top: 50
    }, {
        duration: 175,
        complete: function() {
            tab.Tab.remove();
        }
    })
    if(tabCollection.length == 0) {
        if(settings.get("settings.closeOnLastTab", true)) {
            require('electron').remote.getCurrentWindow().close();
        }

    }
    calcSizes(true, true);
}

function getTabFromMousePoint(callingTab) {
    for(var i = 0; i < tabCollection.length; i++) {
        if(tabCollection[i] != callingTab) {
            if(contains(tabCollection[i].Tab[0])) {
                if(!tabCollection[i].locked)
                    return tabCollection[i];
            }
        }
    }
}

function changePos(callingTab) {
    callingTab.locked = true;
    callingTab.Tab.animate({
        left: tabCollection.indexOf(callingTab) * tabCollection[0].Tab.width(),
        easing: 'easeOutQuint'
    }, {
        duration: 200,
        complete: function() {
            callingTab.locked = false;
        },
        queue: false
    });
}

document.onmousemove = function(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
}
//check if bounds of another tab contains mouse point
function contains(tabToCheck) {
    var rect = tabToCheck.getBoundingClientRect();
    if(cursorX >= rect.left && cursorX <= rect.right) {
        return true;
    }
    return false;
}

//responsive tabs
function calcSizes(animation, addButtonAnimation) {
    var tabCountTemp = 0;
    for(var i = 0; i < tabCollection.length; i++) {
        var tabWidthTemp = tabWidth;
        if(!(($('#tabbar').width() - $('#addTab').width() - 15) / tabCollection.length >= tabWidth)) {
            tabWidthTemp = ($('#tabbar').width() - $('#addTab').width() - 15) / tabCollection.length;
        } else {
            tabWidthTemp = tabWidth;
        }
        tabCollection[i].Tab.css('width', tabWidthTemp);

        if(animation == true) {
            tabCollection[i].Tab.animate({
                left: tabCountTemp * tabCollection[0].Tab.width()
            }, {
                duration: 175,
                queue: false
            });

        } else {
            tabCollection[i].Tab.animate({
                left: tabCountTemp * tabCollection[0].Tab.width()
            }, {
                duration: 0.8,
                queue: false
            });
        }
        tabCountTemp += 1;
    }
    if(tabCollection[0] != null) {
        if(addButtonAnimation == true) {
            $('#addTab').animate({
                left: tabCollection.length * tabCollection[0].Tab.width()
            }, {
                duration: 175,
                queue: false
            });
        } else {
            $('#addTab').css({
                left: tabCollection.length * tabCollection[0].Tab.width()
            });
        }
    } else {
        $('#addTab').animate({
            left: '0px'
        }, {
            duration: 175,
            queue: false
        });
    }
}

$('#addTab').click(function() {
    var tab = new Tab(),
        instance = $('#instances').browser({
            tab: tab,
            url: settings.get("settings.homePage", "kt-browser://newtab")
        })

    addTab(instance, tab);
});

function deselect(tab) {
    tab.Tab.css('background-color', normalColor)
    tab.tabWindow.css({
        height: 0,
        position: 'absolute',
        opacity: 0,
        visibility: 'hidden'
    })
    tab.Tab.css('height', tabHeight - 1)
    tab.Preloader.attr('color', '#3F51B5')
    tab.selected = false;
    if(tab.Foreground == "#fff") {
        tab.closeBtn.css('color', '#000')
        tab.Title.css('color', '#000')
    } else {
        tab.closeBtn.css('color', '#fff')
        tab.Title.css('color', '#fff')
    }
}

function select(tab) {
    tab.Tab.css('background-color', tab.Color);
    var searchInput = tab.instance.bar.searchInput
    tab.tabWindow.css({
        height: $(window).height(),
        position: 'relative',
        opacity: 1,
        visibility: 'visible'
    });
    if(searchInput != null && (searchInput.val() == "" || searchInput.val() == null)) {
        searchInput.focus();
    }

    if(tab.Foreground == '#000') {
        tab.Preloader.attr('color', '#3F51B5')
        tab.Title.css('color', '#444')
        tab.closeBtn.css('color', '#000')
    } else if(tab.Foreground == '#fff') {
        tab.Title.css('color', '#fff')
        tab.Preloader.attr('color', '#fff')
        tab.closeBtn.css('color', '#fff')
    }

    tab.Tab.css('height', tabHeight)
    tab.selected = true;
}

function selectTab(tab) {
    for(var i = 0; i < tabCollection.length; i++) {
        if(tabCollection[i].Tab != tab) {
            deselect(tabCollection[i])
        } else {
            select(tabCollection[i])
        }
    }
    require('electron').remote.getCurrentWindow().webContents.executeJavaScript('updateColor()');
}

function Tab() {}