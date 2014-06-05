'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TimerCtrl', function($scope, $http) {
	$scope.startTest = function(){
		$scope.$broadcast('timer-start');
		$http.get("www.facebook.com").fail(function(){
			console.log($('timer span')[0].innerText);
		});
	}
});