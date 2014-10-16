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
}, {
    'link': 'http://www.godaddy.com/',
    'name': 'godaddy'
}, {
    'link': 'http://www.google.com/',
    'name': 'google'
}, {
    'link': 'http://www.hootsuite.com/',
    'name': 'hootsuite'
}, {
    'link': 'http://www.hostgator.com/',
    'name': 'hostgator'
}, {
    'link': 'http://www.instagram.com/',
    'name': 'instagram'
}, {
    'link': 'http://www.mailchimp.com/',
    'name': 'mailchimp'
}, {
    'link': 'http://www.microsoft.com/',
    'name': 'microsoft'
}, {
    'link': 'http://www.mozilla.org/',
    'name': 'mozilla'
}, {
    'link': 'http://www.netflix.com',
    'name': 'netflix'
}, {
    'link': 'http://www.outbrain.com/',
    'name': 'outbrain'
}, {
    'link': 'http://www.paypal.com/home',
    'name': 'paypal'
}, {
    'link': 'http://www.salesforce.com/',
    'name': 'salesforce'
}, {
    'link': 'http://www.stackoverflow.com/',
    'name': 'stackoverflow'
}, {
    'link': 'http://www.stumbleupon.com/',
    'name': 'stumbleupon'
}, {
    'link': 'http://www.vimeo.com/',
    'name': 'vimeo'
}, {
    'link': 'http://www.w3schools.com/',
    'name': 'w3schools'
}, {
    'link': 'http://www.wikipedia.org/',
    'name': 'wikipedia'
}, {
    'link': 'http://www.wordpress.com/',
    'name': 'wordpress'
}, {
    'link': 'http://www.wordpress.org/',
    'name': 'wordpress'
}, {
    'link': 'http://www.zillow.com/',
    'name': 'zillow'
}];

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