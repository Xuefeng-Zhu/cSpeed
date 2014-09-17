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

var sisterCity = {
    "Urbana" : "Champaign-Urbana",
    "Champaign" : "Champaign-Urbana"
}

google.load("visualization", "1", {
    packages: ["corechart"]
});