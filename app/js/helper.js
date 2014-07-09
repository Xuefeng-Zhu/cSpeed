function measure() {
    if (performance.getEntries().length < 2){
        setTimeout(measure, 1000);
        return;
    }
    chrome.runtime.sendMessage({time: performance.timing, resource: performance.getEntries()});
}

measure();
