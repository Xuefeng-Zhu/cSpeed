//Listener for getting page ip address
chrome.webRequest.onResponseStarted.addListener(
    function(details) {
        if (details.type == "main_frame") {
            console.log(details)
            chrome.runtime.sendMessage({
                details: details
            });
        }
    }, {
        urls: ["<all_urls>"]
    }
);