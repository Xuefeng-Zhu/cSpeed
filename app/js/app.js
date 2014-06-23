'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'timer',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers',
	'ngAnimate', 
	'fx.animations'
	]);

$('.message .close').on('click', function() {
	$(this).closest('.message').fadeOut();
});
