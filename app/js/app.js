'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'timer',
    'myApp.controllers',
    'ngAnimate',
    'fx.animations'
]);

$('.message .close').on('click', function() {
    $(this).closest('.message').fadeOut();
});

var tests = [{
            'link': 'http://www.aws.amazon.com/',
            'name': 'aws'
        }, {
            'link': 'http://www.adcash.com/en/index.php',
            'name': 'adcash'
        }, {
            'link': 'http://www.addthis.com/',
            'name': 'addthis'
        }, {
            'link': 'http://www.adf.ly/',
            'name': 'adf'
        }, {
            'link': 'http://www.adobe.com/',
            'name': 'adobe'
        }, {
            'link': 'http://www.badoo.com/',
            'name': 'badoo'
        }, {
            'link': 'http://www.chase.com/',
            'name': 'chase'
        }, {
            'link': 'http://www.conduit.com/',
            'name': 'conduit'
        }, {
            'link': 'http://www.flickr.com',
            'name': 'flickr'
        }, {
            'link': 'http://www.go.com/',
            'name': 'go'
        }];

var grades = {
            'A': {
                'letter': 'A',
                'color': 'red',
                'comment': 'Fast! Your browsing experience is fast in comparison to both users globally, and in your region.'
            },
	    'A1': {
                'letter': 'A+',
                'color': 'red',
                'comment': 'Super-fast! Your browsing experience is fast in comparison to both users globally, and in your region.'
            },
            'B': {
                'letter': 'B',
                'color': 'green',
                'comment': 'Satisfactory. While your browsing experience is not spectacularly fast, users in your city may not have much choice.'
            },
            'B1': {
                'letter': 'B',
                'color': 'green',
                'comment': 'Satisfactory. You might possibly benefit from checking if other ISPs in your area are faster.'
            },
            'C': {
                'letter': 'C',
                'color': 'blue',
                'comment': 'Meh. Your browsing experience is not quite fast. Unfortunately, you might not have much choice; this is probably just about your location.'
            },
            'C1': {
                'letter': 'C',
                'color': 'blue',
                'comment': 'Meh. Your browsing experience is not quite fast. You might possibly benefit from checking if other ISPs in your area are faster.'
            },
            'D': {
                'letter': 'D',
                'color': 'grey',
                'comment': 'Pretty slow. Your browsing experience is quite slow. Part of it might be due to your location, but you might possibly benefit from checking if other ISPs in your area are faster.'
            }
        }

var sisterCity = {
    "Urbana" : "Champaign-Urbana",
    "Champaign" : "Champaign-Urbana"
}

google.load("visualization", "1", {
    packages: ["corechart"]
});