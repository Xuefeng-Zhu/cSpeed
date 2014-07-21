 chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    App = Ember.Application.create({
        rootElement: '#app'
    });

    App.ApiData = request;

    App.ChromeDevToolsTimetreeView = Ember.Timetree.TimetreeView.extend({
        timeTickFormat: Ember.computed(function() {
            var minTime = this.get('xScale').domain()[0];
            var minTime = d3.min(this.content.mapProperty('start'));
            return function(d) {
                return parseInt(d - minTime) + 'ms';
            };
        }).property(),

        durationFormatter: function(n) {
            return (n.end - n.start) + 'ms';
        }
    });
});

