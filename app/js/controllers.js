'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TimerCtrl', function($scope, $timeout, $http) {
	var fb = new Firebase("https://speedtest.firebaseio.com");
 	
 	fb.child("total").on("value", function(dataSnapshot){
 					console.log(name)
 					var name = dataSnapshot.name();
 					var value = dataSnapshot.val();

 					$scope.total = value;
 					console.log($scope.total);
 	})

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
		$http.get(link).success(function(response) {
			index++;
			if (index == $scope.tests.length){
				$scope.currentTest = undefined;

				$("#currentTest").text("Finish");
				$scope.$broadcast('timer-stop');
				$scope.status = "Run Again";

				$timeout(finalizeTest, 10);
				return;
			}

			$scope.currentTest = $scope.tests[index];
			$scope.finishedTest.push($scope.currentTest);
			$scope.$broadcast('timer-start');
			loadPage($scope.currentTest["link"]);
		});
	}

	$scope.$on('timer-tick', function (event, args) {
		$scope.currentTest.time = args.millis;
	});

	function finalizeTest(){
		var temp = performance.getEntries();
		temp.splice(0,4);
		$scope.upData = {};
		
		for (var i in $scope.tests){
			$scope.upData[$scope.tests[i].name] = temp[i];
			calTotal($scope.tests[i].name, temp[i].duration);
		}

		$scope.total["count"] = $scope.total["count"]? $scope.total["count"] + 1 : 1;
		fb.child('total').set($scope.total);

		$scope.upData.user_info ={};
		$scope.upData.user_info.browser = navigator.appVersion;

		$http.get('http://ip-api.com/json').success(function(response){
			$scope.upData.user_info.ip = response
			fb.child('individuals').push(angular.copy($scope.upData));
		})
	}

	function calTotal(name, time){
		if (!$scope.total){
			$scope.total = {};
		}
		$scope.total[name] = $scope.total[name]? $scope.total[name] + time : time; 
	}
});