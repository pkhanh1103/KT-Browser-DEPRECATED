//Code from Min Browser, thanks to author (https://github.com/minbrowser/min)

//http://stackoverflow.com/a/2091331

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}

var backbutton = document.getElementById("backtoarticle");

function startReaderView(article) {

	document.body.removeChild(parserframe);

	var readerContent = "<link rel='stylesheet' href='readerView.css'>";

	if (!article) {
		readerContent += "<div class='reader-main'><em>Không tìm thấy bài viết nào.</em></div>";
	} else {
		document.title = article.title;

		readerContent += "<div class='reader-main'>" + "<h1 class='article-title'>" + (article.title || "") + "</h1>"

		if (article.byline) {
			readerContent += "<h2 class='article-authors'>" + article.byline + "</h2>"
		}

		readerContent += article.content + "</div>";

	}

	window.rframe = document.createElement("iframe");
	rframe.classList.add("reader-frame");
	rframe.sandbox = "allow-same-origin allow-popups";
	rframe.srcdoc = readerContent;

	rframe.onload = function () {
	if (window.isNightMode()) {
		document.body.style.backgroundColor = "rgb(33, 37, 43)";
		document.getElementById("backtoarticle").style.backgroundColor = "rgb(33, 37, 43)";
		rframe.contentDocument.body.classList.add("dark-mode");
	}
		requestAnimationFrame(function () {
			rframe.height = rframe.contentDocument.body.querySelector(".reader-main").scrollHeight + "px";
			requestAnimationFrame(function () {
				rframe.focus();
			});
		});
	}

	document.body.appendChild(rframe);

	backbutton.addEventListener("click", function (e) {
		window.location = url;
	});

}

var url = getQueryVariable("url");

document.title = "Chế độ đọc | " + url

var parserframe = document.createElement("iframe");
parserframe.className = "temporary-iframe";
parserframe.sandbox = "allow-same-origin";
document.body.appendChild(parserframe);

function processArticle(data) {

	window.d = data;
	parserframe.srcdoc = d;

	parserframe.onload = function () {

		var doc = parserframe.contentDocument;

		var location = new URL(url);

		var links = doc.querySelectorAll("a");

		if (links) {
			for (var i = 0; i < links.length; i++) {
				links[i].target = "_blank";
			}
		}

		var images = doc.querySelectorAll("img")

		for (var i = 0; i < images.length; i++) {
			if (images[i].src && images[i].srcset) {
				images[i].srcset = "";
			}
		}

		var uri = {
			spec: location.href,
			host: location.host,
			prePath: location.protocol + "//" + location.host,
			scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
			pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
		};
		var article = new Readability(uri, doc).parse();
		console.log(article);
		startReaderView(article);
	}

}

fetch(url, {
		credentials: "include",
	})
	.then(function (response) {
		return response.text();
	})
	.then(processArticle)
	.catch(function (data) {
		console.warn("request failed with error", data);
				startReaderView({
					content: "<em>Lỗi khi tải trang. Hãy kiểm tra lại kết nối mạng...</em>"
				});
	});