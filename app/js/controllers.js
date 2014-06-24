'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TimerCtrl', function($scope, $timeout, $http, $q) {
	var fb = new Firebase("https://speedtest.firebaseio.com");
	var index = 0;

	$scope.tests = [
	{"name": "Engadget", "link": "https://www.engadget.com"},
	{"name": "Facebook", "link": "https://www.facebook.com"},
	{"name": "Github", "link": "https://www.github.com"},
	{"name": "Google", "link": "https://www.google.com"},
	{"name": "Linkedin", "link": "https://www.linkedin.com"},
	{"name": "Twitter", "link": "https://www.twitter.com"},
	{"name": "Wikipedia", "link": "https://www.wikipedia.org"},
	{"name": "Yahoo", "link": "https://www.yahoo.com"},
	{"name": "Youtube", "link": "https://www.youtube.com"}];
	$scope.total = null;
	$scope.status = "Start Test";

	fb.child("total").on("value", function(dataSnapshot){
		var name = dataSnapshot.name();
		var value = dataSnapshot.val();

		$scope.total = value;
	});
	

	$scope.startTest = function(){
		index = 0;

		$scope.upData = {};
		$scope.report = {};
		$scope.finishedTest = [];

		$scope.currentTest = $scope.tests[index];
		$scope.$broadcast('timer-start');
		$scope.finishedTest.push($scope.currentTest);

		loadPage($scope.currentTest["link"]);
		$scope.status = "Test is running"
	}

	$scope.$on('timer-tick', function (event, args) {
		$scope.currentTest.time = args.millis;
	});

	function loadPage(link){
		$http.get(link).success(function(response) {
			//load individual test result 
			loadResult(index);

			index++;
			//check if the test is at the end 
			if (index == $scope.tests.length){
				$scope.currentTest = undefined;

				$("#currentTest").text("Finish");
				$scope.$broadcast('timer-stop');
				$scope.status = "Run Again";

				$timeout(finalizeTest, 200);
				return;
			}

			$scope.currentTest = $scope.tests[index];
			$scope.finishedTest.push($scope.currentTest);
			$scope.$broadcast('timer-start');
			loadPage($scope.currentTest["link"]);
		});
	}

	function loadResult(index){
		loadHelper(index).then(function(status){
			console.log(status);
		},function(status){
			alert("fail, test result will be reloaded. Please report the error in console to zhuxuefeng1994@126.com");
			loadResult(status);
		});
	}

	function loadHelper(index){
		var deferred = $q.defer();

		$timeout(function(){
			var temp = performance.getEntries();
			if (temp.length > 4 + index)
			{
				$scope.upData[$scope.tests[index]["name"]] = temp[4+index];
				$scope.finishedTest[index].time = temp[4+index].duration;
				deferred.resolve(index);
			}
			else{
				deferred.reject(index);
			}
		},100);

		return deferred.promise;
	}

	function finalizeTest(){
		
		var userRef = fb.child('individuals').push(angular.copy($scope.upData));
		$http.get('http://ip-api.com/json').success(function(response){
			var user_info ={};
			user_info.browser = navigator.appVersion;
			user_info.ip = response
			userRef.child('user_info').set(user_info);
		})

		for (var i in $scope.tests){
			calTotal($scope.tests[i].name, $scope.upData[$scope.tests[i].name].duration);
		}
		$scope.total["count"] = $scope.total["count"]? $scope.total["count"] + 1 : 1;
		fb.child('total').set($scope.total);

		generateReport();
	}

	function calTotal(name, time){
		if (!$scope.total){
			$scope.total = {};
		}
		$scope.total[name] = $scope.total[name]? $scope.total[name] + time : time; 
	}

	function generateReport(){
		var uTotal = 0;
		var oTotal = 0;
		angular.forEach($scope.upData, function(value, key){
			var avg = $scope.total[key] / $scope.total.count;

			uTotal += value.duration;
			oTotal += avg;
			var temp = (value.duration - avg) / avg * 100;
			temp = Math.round(temp);

			if (temp >= 0){
				$scope.report[key] = {
					"value": temp,
					"up": false
				}
			}
			else{
				$scope.report[key] = {
					"value": - temp,
					"up": true
				}
			}
		});

		var temp = (uTotal - oTotal) / oTotal * 100;
		temp = Math.round(temp);

		var comparation = temp >= 0 ? {
			"key": "slower",
			"value": temp 
		}:{
			"key": "faster",
			"value": -temp
		} 
		$scope.report["summary"] = {
			"uTotal" : Math.round(uTotal),
			"oTotal" : Math.round(oTotal),
			"comparation": comparation
		}

		console.log($scope.report);
	}
});