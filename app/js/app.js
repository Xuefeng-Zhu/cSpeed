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

var tests = [{'link': 'http://www.aws.amazon.com/', 'name': 'aws', 'showName': 'www.aws.amazon.com'} ,
{'link': 'http://www.adcash.com/', 'name': 'adcash', 'showName': 'www.adcash.com'} ,
// {'link': 'http://www.addthis.com/', 'name': 'addthis', 'showName': 'www.addthis.com'} ,
// {'link': 'http://www.adf.ly/', 'name': 'adf', 'showName': 'www.adf.ly'} ,
// {'link': 'http://www.adobe.com/', 'name': 'adobe', 'showName': 'www.adobe.com'} ,
// {'link': 'http://www.badoo.com/', 'name': 'badoo', 'showName': 'www.badoo.com'} ,
// {'link': 'http://www.bankofamerica.com/', 'name': 'bankofamerica', 'showName': 'www.bankofamerica.com'} ,
// {'link': 'http://www.chase.com/', 'name': 'chase', 'showName': 'www.chase.com'} ,
// {'link': 'http://www.conduit.com/', 'name': 'conduit', 'showName': 'www.conduit.com'} ,
// {'link': 'http://www.flickr.com', 'name': 'flickr', 'showName': 'www.flickr.com'} ,
// {'link': 'http://www.go.com/', 'name': 'go', 'showName': 'www.go.com'} ,
// {'link': 'http://www.godaddy.com/', 'name': 'godaddy', 'showName': 'www.godaddy.com'} ,
// {'link': 'http://www.google.com/', 'name': 'google', 'showName': 'www.google.com'} ,
// {'link': 'http://www.hootsuite.com/', 'name': 'hootsuite', 'showName': 'www.hootsuite.com'} ,
// {'link': 'http://www.hostgator.com/', 'name': 'hostgator', 'showName': 'www.hostgator.com'} ,
// {'link': 'http://www.instagram.com/', 'name': 'instagram', 'showName': 'www.instagram.com'} ,
// {'link': 'http://www.mailchimp.com/', 'name': 'mailchimp', 'showName': 'www.mailchimp.com'} ,
// {'link': 'http://www.microsoft.com/', 'name': 'microsoft', 'showName': 'www.microsoft.com'} ,
// {'link': 'http://www.mozilla.org/', 'name': 'mozilla', 'showName': 'www.mozilla.org'} ,
// {'link': 'http://www.netflix.com', 'name': 'netflix', 'showName': 'www.netflix.com'} ,
// {'link': 'http://www.outbrain.com/', 'name': 'outbrain', 'showName': 'www.outbrain.com'} ,
// {'link': 'http://www.paypal.com/home', 'name': 'paypal', 'showName': 'www.paypal.com/home'} ,
// {'link': 'http://www.salesforce.com/', 'name': 'salesforce', 'showName': 'www.salesforce.com'} ,
// {'link': 'http://www.stackoverflow.com/', 'name': 'stackoverflow', 'showName': 'www.stackoverflow.com'} ,
// {'link': 'http://www.stumbleupon.com/', 'name': 'stumbleupon', 'showName': 'www.stumbleupon.com'} ,
// {'link': 'http://www.vimeo.com/', 'name': 'vimeo', 'showName': 'www.vimeo.com'} ,
// {'link': 'http://www.w3schools.com/', 'name': 'w3schools', 'showName': 'www.w3schools.com'} ,
// {'link': 'http://www.wikipedia.org/', 'name': 'wikipedia', 'showName': 'www.wikipedia.org'} ,
// {'link': 'http://www.wordpress.com/', 'name': 'wordpress', 'showName': 'www.wordpress.com'} ,
// {'link': 'http://www.wordpress.org/', 'name': 'wordpress', 'showName': 'www.wordpress.org'} ,
{'link': 'http://www.zillow.com/', 'name': 'zillow', 'showName': 'www.zillow.com'} ];

var grades = {
    'A': {
        'letter': 'A',
        'color': 'red',
        'comment': 'Fast! Your browsing experience is fast in comparison to both users globally, and in your city.'
    },
    'A1': {
        'letter': 'A+',
        'color': 'red',
        'comment': 'Super-fast! Your browsing experience is fast in comparison to both users globally, and in your city.'
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
    'D1': {
        'letter': 'D',
        'color': 'grey',
        'comment': 'Pretty slow. Your browsing experience is quite slow. Part of it might be due to your location, but you might possibly benefit from checking if other ISPs in your area are faster.'
    },
    'D': {
        'letter': 'D',
        'color': 'grey',
        'comment': 'Pretty slow. Your browsing experience is quite slow, possibly just due to your location or your device. There may also be networks in your area with faster test completion times, but we have not seen any so far.'
    }
}

var sisterCity = {
    "Urbana": "Champaign-Urbana",
    "Champaign": "Champaign-Urbana"
}

google.load("visualization", "1", {
    packages: ["corechart"]
});