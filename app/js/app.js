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
    'link': 'https://www.adcash.com/en/index.php',
    'name': 'adcash'
}, {
    'link': 'https://www.addthis.com/',
    'name': 'addthis'
}, {
    'link': 'https://www.adf.ly/',
    'name': 'adf'
}/*, {
    'link': 'https://www.adobe.com/',
    'name': 'adobe'
}, {
    'link': 'https://www.badoo.com/',
    'name': 'badoo'
}, {
    'link': 'https://www.chase.com/',
    'name': 'chase'
}, {
    'link': 'https://www.conduit.com/',
    'name': 'conduit'
}, {
    'link': 'https://www.flickr.com',
    'name': 'flickr'
}, {
    'link': 'http://www.go.com/',
    'name': 'go'
}, {
    'link': 'https://www.godaddy.com/',
    'name': 'godaddy'
}, {
    'link': 'https://www.google.com/',
    'name': 'google'
}, {
    'link': 'https://www.hootsuite.com/',
    'name': 'hootsuite'
}, {
    'link': 'https://www.hostgator.com/',
    'name': 'hostgator'
}, {
    'link': 'https://www.instagram.com/',
    'name': 'instagram'
}, {
    'link': 'https://www.mailchimp.com/',
    'name': 'mailchimp'
}, {
    'link': 'https://www.microsoft.com/',
    'name': 'microsoft'
}, {
    'link': 'https://www.mozilla.org/',
    'name': 'mozilla'
}, {
    'link': 'https://www.netflix.com',
    'name': 'netflix'
}, {
    'link': 'https://www.outbrain.com/',
    'name': 'outbrain'
}, {
    'link': 'https://www.paypal.com/home',
    'name': 'paypal'
}, {
    'link': 'https://www.salesforce.com/',
    'name': 'salesforce'
}, {
    'link': 'https://www.stackoverflow.com/',
    'name': 'stackoverflow'
}, {
    'link': 'https://www.stumbleupon.com/',
    'name': 'stumbleupon'
}, {
    'link': 'https://www.vimeo.com/',
    'name': 'vimeo'
}, {
    'link': 'http://www.w3schools.com/',
    'name': 'w3schools'
}, {
    'link': 'https://www.wikipedia.org/',
    'name': 'wikipedia'
}, {
    'link': 'https://www.wordpress.com/',
    'name': 'wordpress'
}, {
    'link': 'https://www.wordpress.org/',
    'name': 'wordpress'
}, {
    'link': 'http://www.zillow.com/',
    'name': 'zillow'
}*/];

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
