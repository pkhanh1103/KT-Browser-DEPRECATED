 (function ($) {
     $.fn.searchInput = function (params) {
         var settings = $.extend({
                 tab: null
             }, params)
             , t = this
             , webview = settings.tab.instance.webview.webview


         $(this)
             .focusin(function () {
                 $(this)
                     .select();
             });
         $(this)
             .keypress(function (e) {
                 var suggestions = suggestions = settings.tab.instance.bar.suggestions
                 //if enter key was pressed

                 if (e.which == 13) {
                     suggestions.css('display', 'none')
                     if (!$(t)
                         .val()
                         .startsWith("kt-browser://")) {
                         if (isURL($(t)
                                 .val())) {
                             if ($(t)
                                 .val()
                                 .startsWith("http://") || $(t)
                                 .val()
                                 .startsWith("https://") || $(t)
                                 .val()
                                 .startsWith("file://")) {
                                 webview.loadURL($(t)
                                     .val());
                             } else {
                                 webview.loadURL("http://" + $(t)
                                     .val());
                             }
                         } else {
                             switch (require('electron-settings').get('settings.SearchEngine')) {
                             case "1":
                                 webview.loadURL("http://www.google.com/search?q=" + $(t)
                                     .val());
                                 break;
                             case "2":
                                 webview.loadURL("http://coccoc.com/search#query=" + $(t)
                                     .val());
                                 break;
                             case "3":
                                 webview.loadURL("https://duckduckgo.com/?q=" + $(t)
                                     .val());
                                 break;
                             case "4":
                                 webview.loadURL("https://www.bing.com/search?q=" + $(t)
                                     .val());
                                 break;
                             case "5":
                                 webview.loadURL("https://search.yahoo.com/search?p=" + $(t)
                                     .val());
                                 break;
                             case "6":
                                 webview.loadURL("https://www.yandex.com/search/?text=" + $(t)
                                     .val());
                                 break;
                             }

                         }
                     } else {
                         webview.loadURL($(t)
                             .val());
                     }

                     return false;
                 }
             });
         return this
     }
 }(jQuery))
