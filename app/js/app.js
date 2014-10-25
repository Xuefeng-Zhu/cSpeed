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

var tests = [
//{'link': 'https://www.aws.amazon.com/', 'name': 'aws', 'showName': 'www.aws.amazon.com'} ,
// {'link': 'https://www.adcash.com/', 'name': 'adcash', 'showName': 'www.adcash.com'} ,
// {'link': 'https://www.addthis.com/', 'name': 'addthis', 'showName': 'www.addthis.com'} ,
// {'link': 'https://www.adf.ly/', 'name': 'adf', 'showName': 'www.adf.ly'} ,
// {'link': 'https://www.adobe.com/', 'name': 'adobe', 'showName': 'www.adobe.com'} ,
// {'link': 'https://www.badoo.com/', 'name': 'badoo', 'showName': 'www.badoo.com'} ,
//{'link': 'https://www.bankofamerica.com/', 'name': 'bankofamerica', 'showName': 'www.bankofamerica.com'} ,
//{'link': 'https://www.chase.com/', 'name': 'chase', 'showName': 'www.chase.com'} ,
//{'link': 'https://www.conduit.com/', 'name': 'conduit', 'showName': 'www.conduit.com'} ,
{'link': 'http://coccoc.com/', 'name': 'coccoc', 'showName': 'coccoc.com'} ,
//{'link': 'https://www.flickr.com/', 'name': 'flickr', 'showName': 'www.flickr.com'} ,
//{'link': 'https://www.go.com/', 'name': 'go', 'showName': 'www.go.com'} ,
{'link': 'https://www.godaddy.com/', 'name': 'godaddy', 'showName': 'www.godaddy.com'} ,
{'link': 'https://www.google.com/', 'name': 'google', 'showName': 'www.google.com'} ,
//{'link': 'https://www.hootsuite.com/', 'name': 'hootsuite', 'showName': 'www.hootsuite.com'} ,
// {'link': 'https://www.hostgator.com/', 'name': 'hostgator', 'showName': 'www.hostgator.com'} ,
// {'link': 'https://www.instagram.com/', 'name': 'instagram', 'showName': 'www.instagram.com'} ,
// {'link': 'https://www.mailchimp.com/', 'name': 'mailchimp', 'showName': 'www.mailchimp.com'} ,
// {'link': 'https://www.microsoft.com/', 'name': 'microsoft', 'showName': 'www.microsoft.com'} ,
// {'link': 'https://www.mozilla.org/', 'name': 'mozilla', 'showName': 'www.mozilla.org'} ,
// {'link': 'https://www.netflix.com', 'name': 'netflix', 'showName': 'www.netflix.com'} ,
// {'link': 'https://www.outbrain.com/', 'name': 'outbrain', 'showName': 'www.outbrain.com'} ,
//{'link': 'https://www.paypal.com/home', 'name': 'paypal', 'showName': 'www.paypal.com'} ,
// {'link': 'https://www.salesforce.com/', 'name': 'salesforce', 'showName': 'www.salesforce.com'} ,
//{'link': 'https://www.stackoverflow.com/', 'name': 'stackoverflow', 'showName': 'www.stackoverflow.com'} ,
{'link': 'https://www.stumbleupon.com/', 'name': 'stumbleupon', 'showName': 'www.stumbleupon.com'} ,
{'link': 'https://www.vimeo.com/', 'name': 'vimeo', 'showName': 'www.vimeo.com'} ,
//{'link': 'https://www.w3schools.com/', 'name': 'w3schools', 'showName': 'www.w3schools.com'} ,
{'link': 'https://www.wikipedia.org/', 'name': 'wikipedia', 'showName': 'www.wikipedia.org'} ,
{'link': 'https://www.wordpress.com/', 'name': 'wordpress', 'showName': 'www.wordpress.com'}
//{'link': 'https://www.wordpress.org/', 'name': 'wordpress', 'showName': 'www.wordpress.org'} ,
//{'link': 'https://www.zillow.com/', 'name': 'zillow', 'showName': 'www.zillow.com'}
];

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
        'comment': 'Satisfactory. You should check if other ISPs in your area are faster.'
    },
    'C': {
        'letter': 'C',
        'color': 'blue',
        'comment': 'Meh. Your browsing experience is not quite fast. Unfortunately, you might not have much choice; this is probably just about your location.'
    },
    'C1': {
        'letter': 'C',
        'color': 'blue',
        'comment': 'Meh. Your browsing experience is not quite fast. You should check if other ISPs in your area are faster.'
    },
    'D1': {
        'letter': 'D',
        'color': 'grey',
        'comment': 'Pretty slow. Your browsing experience is quite slow. Some of it might be due to your location, but you should check if other ISPs in your area are faster.'
    },
    'D': {
        'letter': 'D',
        'color': 'grey',
        'comment': 'Pretty slow. Your browsing experience is quite slow. Some of it might be due to your location, but you should check if other ISPs in your area are faster.'
    }
}

var sisterCity = {
    "Urbana": "Champaign-Urbana",
    "Champaign": "Champaign-Urbana"
}

google.load("visualization", "1", {
    packages: ["corechart"]
});
