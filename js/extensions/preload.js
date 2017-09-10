var fs = require('fs');
const {
	ipcRenderer
} = require('electron')
const {
	app
} = require('electron').remote;
const remote = require('electron').remote;
var window = remote.getCurrentWindow();
const settings = require('electron-settings');
var historyPath = app.getPath('userData') + '/User Data/History';
var userdataPath = app.getPath('userData') + '/User Data';

global.getHistoryData = function () {
	return JSON.parse(fs.readFileSync(historyPath));
}

global.isfullscreen = function () {
	return window.isFullScreen();
}

global.setfullscreen = function (flag) {
	return window.setFullScreen(flag);
}

global.getSearchEngine = function() {
    return settings.get('settings.SearchEngine');
}

global.isNightMode = function() {
    return settings.get('static.NightMode');
}

global.saveHistory = function (json) {
	fs.writeFile(historyPath, json, function (err) {
		if (err) {
			return true;
		}
	});
}

global.removeHistory = function (callback = function () {}) {
	fs.unlink(historyPath, callback);
}

global.addressBarFocus = function () {
	for (var i = 0; i < parent.tabCollection.length; i++) {
		if (parent.tabCollection[i].selected) {
			var itab = parent.tabCollection[i]
			$(itab.tabWindow.find('.searchInput')).focus();
		}
	}
}

global.getReaderScore = function () {
  var paragraphs = document.querySelectorAll('p')
  var tl = 0
  if (!paragraphs) {
    return
  }
  for (var i = 0; i < paragraphs.length; i++) {
    tl += Math.max(paragraphs[i].textContent.length - 100, -30)
  }
  return tl
}

document.addEventListener("click", function () {
	ipcRenderer.sendToHost("clicked");
})

function setStatus(status) {
	ipcRenderer.sendToHost('status', status);
}

document.addEventListener('mouseover', function (e) {
	var el = e.target
	while (el) {
		if (el.tagName == 'A') {
			if (el.getAttribute('title'))
				setStatus(el.getAttribute('title'))
			else if (el.href)
				setStatus(el.href)
			return
		}
		el = el.parentNode
	}
	setStatus(false)
})