  chrome.browserAction.onClicked.addListener(function(tab){
  	var url = chrome.extension.getURL('index.html');
  	chrome.tabs.create({url: url})
  })