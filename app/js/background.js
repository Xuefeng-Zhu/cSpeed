//Listener for getting page ip address
timer = null;
ipList = {};

chrome.webRequest.onResponseStarted.addListener(
    function(details) {
        if (details.type == "main_frame") {
            chrome.runtime.sendMessage({
                details: details
            });
        } else {
            if (!details.ip in ipList) {
                ipList[ip] = true;
            }
        }
    }, {
        urls: ["<all_urls>"]
    }
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.details == undefined) {
        if (timer){
            clearSetTimeout(timer);
        }
        setTimeout(sendIpList, 15000);
        sendIpList();
    }
})

function sendIpList() {
    chrome.runtime.sendMessage({
        ipList: ipList
    });
    ipList = {};
}