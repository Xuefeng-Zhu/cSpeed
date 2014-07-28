'use strict';

/* Controllers */


angular.module('myApp.controllers', [])
    .controller('TimerCtrl', function($scope, $timeout, $http, $q) {
        var fb = new Firebase("https://speedtest.firebaseio.com");
        var index = 0;
        var user_info = {};
        $scope.tests = [{
                "name": "Engadget",
                "link": "https://www.engadget.com"
            }
            // , {
            //     "name": "Facebook",
            //     "link": "https://www.facebook.com"
            // }, {
            //     "name": "Github",
            //     "link": "https://www.github.com"
            // }, {
            //     "name": "Google",
            //     "link": "https://www.google.com"
            // }, {
            //     "name": "Linkedin",
            //     "link": "https://www.linkedin.com"
            // }, {
            //     "name": "Twitter",
            //     "link": "https://www.twitter.com"
            // }, {
            //     "name": "Wikipedia",
            //     "link": "https://www.wikipedia.org"
            // }, {
            //     "name": "Yahoo",
            //     "link": "https://www.yahoo.com"
            // }, {
            //     "name": "Youtube",
            //     "link": "https://www.youtube.com"
            // }
        ];
        $scope.total = null;
        $scope.isp = null;
        $scope.region = null;
        $scope.status = "Start Test";

        fb.child("total").once("value", function(dataSnapshot) {
            $scope.total = dataSnapshot.val();
        });

        $http.get('http://ip-api.com/json').success(function(response) {
            user_info.browser = navigator.appVersion;
            user_info.ip = response
            user_info.date = Date();

            fb.child("isp/" + response.isp).once("value", function(dataSnapshot) {
                $scope.isp = dataSnapshot.val();
            });
            fb.child("region/" + response.region).once("value", function(dataSnapshot) {
                $scope.region = dataSnapshot.val();
            });

        })
        $scope.startTest = function() {
            index = 0;
            performance.webkitClearResourceTimings();
            $scope.upData = {};
            $scope.report = {};
            $scope.finishedTest = [];

            var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
            var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
            chrome.browsingData.removeCache({
                "since": oneWeekAgo,
                "originTypes": {
                    "protectedWeb": true
                }
            }, function() {
                $scope.currentTest = $scope.tests[index];
                $scope.$broadcast('timer-start');
                $scope.finishedTest.push($scope.currentTest);
                $scope.$digest();
                chrome.tabs.create({
                    url: $scope.currentTest.link,
                    active: false
                }, function(tab) {
                    chrome.tabs.executeScript(tab.id, {
                        file: "js/helper.js"
                    })
                });
                $scope.status = "Test is running"
            });


        }

        $scope.showResource = function(test) {
            chrome.tabs.create({
                url: "timeline.html",
                active: true
            }, function(tab) {
                var message = [{
                    "label": "Network Requests",
                    "start": 0,
                    "end": test.data.time.loadEventEnd - test.data.time.navigationStart,
                    "className": "network"
                }];
                var resource = test.data.resource;
                for (var i in resource) {
                    var temp = purl(resource[i].name);

                    var data = {
                        "label": temp.attr('file') == "" ? temp.attr("path") : temp.attr('file'),
                        "start": Math.round(resource[i].fetchStart),
                        "end": Math.round(resource[i].responseEnd),
                        "className": resource[i].initiatorType,
                        "parent": 0
                    }
                    message.push(data);
                }
                $timeout(function() {
                    chrome.tabs.sendMessage(tab.id, message);
                }, 100);
            });
        }

        $scope.$on('timer-tick', function(event, args) {
            $scope.currentTest.time = args.millis;
            $scope.$digest()
        });

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.details) {
                $scope.currentTest.ip = request.details.ip;
                return;
            }
            chrome.tabs.remove(sender.tab.id);
            loadResult(index, request);

            index++;
            //check if the test is at the end 
            if (index == $scope.tests.length) {
                $scope.currentTest = undefined;
                $("#currentTest").text("Finish");
                $scope.$broadcast('timer-stop');
                $scope.status = "Run Again";

                finalizeTest();
                return;
            }

            $scope.currentTest = $scope.tests[index];
            $scope.finishedTest.push($scope.currentTest);
            $scope.$broadcast('timer-start');
            chrome.tabs.create({
                url: $scope.currentTest.link,
                active: false
            }, function(tab) {
                chrome.tabs.executeScript(tab.id, {
                    file: "js/helper.js"
                })
            });
            $scope.$digest();
        });

        function loadResult(index, data) {
            $scope.upData[$scope.tests[index]["name"]] = {
                time: data.time,
                ip: $scope.finishedTest[index].ip
            };
            $scope.finishedTest[index].time = data.time.loadEventEnd - data.time.navigationStart;
            //$scope.finishedTest[index].resource = data.resource;
            $scope.finishedTest[index].data = data;
        }

        function finalizeTest() {
            //upload test timing data 
            var userRef = fb.child('individuals').push(angular.copy($scope.upData));

            //upload user info
            userRef.child('user_info').set(user_info);

            $http.get('http://ip-api.com/json').success(function(response) {
                //somewhere wierd code fails without this call
            });

            if (!$scope.total) $scope.total = {};
            if (!$scope.isp) $scope.isp = {};
            if (!$scope.region) $scope.region = {};

            for (var i in $scope.finishedTest) {
                calTotal($scope.finishedTest[i].name, $scope.finishedTest[i].time);
            }
            $scope.total["count"] = $scope.total["count"] ? $scope.total["count"] + 1 : 1;
            $scope.isp["count"] = $scope.isp["count"] ? $scope.isp["count"] + 1 : 1;
            $scope.region["count"] = $scope.region["count"] ? $scope.region["count"] + 1 : 1;

            fb.child('total').set($scope.total);
            fb.child('isp/' + user_info.ip.isp).set($scope.isp);
            fb.child('region/' + user_info.ip.region).set($scope.region);

            $scope.generateReport($scope.total, "Total");

            $('.ui.successful.progress').popup({
                content: 'Click me to show more infomation'
            });

        }

        function calTotal(name, time) {
            $scope.total[name] = $scope.total[name] ? $scope.total[name] + time : time;
            $scope.isp[name] = $scope.isp[name] ? $scope.isp[name] + time : time;
            $scope.region[name] = $scope.region[name] ? $scope.region[name] + time : time;
        }

        $scope.generateReport = function(data, tab) {
            var uTotal = 0;
            var oTotal = 0;
            angular.forEach($scope.finishedTest, function(value, key) {
                var avg = data[value.name] / data.count;

                uTotal += value.time;
                oTotal += avg;
                var temp = (value.time - avg) / avg * 100;
                temp = Math.round(temp);

                if (temp >= 0) {
                    $scope.report[value.name] = {
                        "value": temp,
                        "up": false
                    }
                } else {
                    $scope.report[value.name] = {
                        "value": -temp,
                        "up": true
                    }
                }
            });

            var temp = (uTotal - oTotal) / oTotal * 100;
            temp = Math.round(temp);

            var comparation = temp >= 0 ? {
                "key": "slower",
                "value": temp
            } : {
                "key": "faster",
                "value": -temp
            }
            $scope.report["summary"] = {
                "uTotal": Math.round(uTotal),
                "oTotal": Math.round(oTotal),
                "comparation": comparation,
            }
            $scope.report.tab = tab;
            $scope.report.data = data;
        }

    });