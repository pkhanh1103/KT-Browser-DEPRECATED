//Code from Min Browser (https://github.com/minbrowser/min/blob/0a07a99415d8670e49c03a6e12d76a427784964e/main/filtering.js), thanks to author!
const electron = require('electron')
var session = electron.session

var thingsToFilter = {
  trackers: true,
  contentTypes: [] // script, image
}

var filterContentTypes = thingsToFilter.contentTypes.length !== 0

var parser
var parsedFilterData = {}

function initFilterList () {
  parser = require('abp-filter-parser')

  var data = require('fs').readFile(__dirname + '/data/adblock/blocklist.txt', 'utf8', function (err, data) {
    if (err) {
      return
    }

    // data = data.replace(/.*##.+\n/g, '') // remove element hiding rules

    parser.parse(data, parsedFilterData)
  })
}

function handleRequest (details, callback) {
  if (!(details.url.startsWith('http://') || details.url.startsWith('https://')) || details.resourceType === 'mainFrame') {
    callback({
      cancel: false,
      requestHeaders: details.requestHeaders
    })
    return
  }

  // block javascript and images if needed

  if (filterContentTypes) {
    for (var i = 0; i < thingsToFilter.contentTypes.length; i++) {
      if (details.resourceType === thingsToFilter.contentTypes[i]) {
        callback({
          cancel: true,
          requestHeaders: details.requestHeaders
        })
        return
      }
    }
  }

  if (thingsToFilter.trackers) {
    if (parser.matches(parsedFilterData, details.url, {
      domain: '',
      elementType: details.resourceType
    })) {
      callback({
        cancel: true,
        requestHeaders: details.requestHeaders
      })
      console.log("Blocked ADS!")
      return
    }
  }

  callback({
    cancel: false,
    requestHeaders: details.requestHeaders
  })
}

global.registerFiltering = function (ses) {
  initFilterList()  

  filterContentTypes = thingsToFilter.contentTypes.length !== 0

  ses.webRequest.onBeforeRequest(handleRequest)
  console.log("ADBlock Started")
}