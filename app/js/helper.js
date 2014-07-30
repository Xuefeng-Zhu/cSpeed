//This function will send timing data to extension untill the page gets loaded 
function measure() {
    if (performance.timing.loadEventEnd == 0) {
        setTimeout(measure, 1000);
        return;
    }
    chrome.runtime.sendMessage({
        time: performance.timing,
        resource: performance.getEntries()
    });
}

measure();