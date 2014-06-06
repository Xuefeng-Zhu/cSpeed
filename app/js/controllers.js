'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TimerCtrl', function($scope) {
	$scope.startTest = function(){
		$.get("http://www.engadget.com", function(response) {
			console.log($('timer span')[0].innerText);
		});

		$scope.$broadcast('timer-start');
	}
});