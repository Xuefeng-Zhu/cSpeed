chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
    top: 0,
    left: 0,
    width: 640,
    height: 720
  });
})
