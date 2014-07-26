chrome.webRequest.onResponseStarted.addListener(
    function(details) {
        if (true) {
            console.log(details);
        }
    }, {
        urls: ["<all_urls>"]
    }
);