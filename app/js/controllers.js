'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TimerCtrl', function($scope) {

	$scope.tests = [{"name": "Facebook", "link": "https://www.facebook.com"},
	{"name": "Google", "link": "https://www.google.com"},
	{"name": "Engadget", "link": "https://www.engadget.com"},
	{"name": "Github", "link": "https://www.github.com"},
	{"name": "Linkedin", "link": "https://www.linkedin.com"},
	{"name": "Youtube", "link": "https://www.youtube.com"},
	{"name": "Yahoo", "link": "https://www.yahoo.com"},
	{"name": "Wikipedia", "link": "https://www.wikipedia.org"},
	{"name": "Twitter", "link": "https://www.twitter.com"}];

	$('.message .close').on('click', function() {
		$(this).closest('.message').fadeOut();
	});
	
	var index = 0;
	$scope.status = "Start Test"

	$scope.startTest = function(){
		index = 0;
		$scope.currentTest = $scope.tests[index];
		$scope.finishedTest = [];

		$scope.$broadcast('timer-start');
		$scope.finishedTest.push($scope.currentTest);

		loadPage($scope.currentTest["link"]);
		$scope.status = "Test is running"
	}

	function loadPage(link){
		$.get(link, function(response) {

			index++;
			if (index == $scope.tests.length){
				$scope.currentTest = undefined;

				$("#currentTest").text("Finish");
				$scope.$broadcast('timer-stop');
				$scope.status = "Run Again";
				$scope.$digest();
				return;
			}

			$scope.currentTest = $scope.tests[index];
			$scope.finishedTest.push($scope.currentTest);
			$scope.$broadcast('timer-start');
			$scope.$digest();
			loadPage($scope.currentTest["link"]);
		});
	}

	$scope.$on('timer-tick', function (event, args) {
		$scope.currentTest.time = args.millis;
	});
});