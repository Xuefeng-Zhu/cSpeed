'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TimerCtrl', function($scope) {

	$scope.tests = [{"name": "Facebook", "link": "https://www.facebook.com"},
	{"name": "Google", "link": "https://www.google.com"},
	{"name": "Engadget", "link": "https://www.engadget.com"},
	{"name": "Reddit", "link": "https://www.reddit.com"},
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
	$("#currentTest").text("Facebook");

	$scope.startTest = function(){
		index = 0;
		$scope.currentTest = $scope.tests[index];
		$("#currentTest").text($scope.currentTest.name);

		$scope.$broadcast('timer-start');

		loadPage($scope.currentTest["link"]);
	}

	function loadPage(link){
		$.get(link, function(response) {
			console.log($('timer span')[0].innerText);

			index++;
			if (index == $scope.tests.length){
				$scope.currentTest = undefined;
				$("#currentTest").text("Finish");
				$scope.$broadcast('timer-stop');
				return;
			}

			$scope.currentTest = $scope.tests[index];
			$("#currentTest").text($scope.currentTest.name);


			$scope.$broadcast('timer-start');
			loadPage($scope.currentTest["link"]);

		});
	}
});