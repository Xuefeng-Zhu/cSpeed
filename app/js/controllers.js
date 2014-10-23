'use strict';
/* Controllers */
angular.module('myApp.controllers', [])
    .controller('TimerCtrl', function($scope, $timeout, $http, $q, $filter) {
        var fb = new Firebase("https://speedtest.firebaseio.com"); //firebase reference
        var index = 0; //index for test
        var user_info = {}; //user information like ip address, web browser, and date
        var entry_point = null;

        $scope.tests = tests;
        $scope.grades = grades;
        $scope.total = null; //total speed statics
        $scope.region = null; //speed statics in same region
        $scope.status = "Run cSpeed to find out!";
        //load statics to total
        fb.child("total").once("value", function(dataSnapshot) {
            $scope.total = dataSnapshot.val();
            $scope.$digest();
        });
        //get user ip address and load statics to isp and region
        $http.get('http://ip-api.com/json').success(function(response) {
            //map city
            if (response.city == "") {
                response.city = prompt("We cannot locate your city. Please input manually");
            }
            if (sisterCity[response.city]) {
                response.city = sisterCity[response.city];
            }
            user_info.ip = response;
            user_info.browser = navigator.appVersion;
            user_info.date = Date();
            user_info.windowSize = {
                height: window.outerHeight,
                width: window.outerWidth
            };

            $scope.user_ip = response;
            fb.child("region/" + response.city).once("value", function(dataSnapshot) {
                $scope.region = dataSnapshot.val();
                $scope.$digest();
            });
        })
        $scope.startTest = function() {
            if ($scope.currentTest) {
                return;
            }
            index = 0;
            performance.webkitClearResourceTimings(); //clear perfomance statics
            $scope.upData = {};
            $scope.report = {};
            $scope.finishedTest = [];
            //clear cache and open new tab for test site
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
                    $scope.currentTest.tab = tab;
                    chrome.tabs.executeScript(tab.id, {
                        file: "js/helper.js"
                    })
                });
                $scope.status = "Test is running"
            });
        }
        //update individual timer in real time
        $scope.$on('timer-tick', function(event, args) {
            $scope.currentTest.time = args.millis / 1.5;
            $scope.$digest()
            if (args.millis >= 15000) {
                $scope.currentTest.time = 15000;
                $scope.upData[$scope.currentTest["name"]] = {
                    time: {
                        status: "timeout",
                        loadEventEnd: $scope.total[$scope.currentTest["name"]],
                        navigationStart: 0
                    },
                    ip: $scope.finishedTest[index].ip
                };
                chrome.tabs.remove($scope.currentTest.tab.id);
                loadNextTest();
            }
        });
        /*
        get message including ip, timing and resource data
        when receive timing data, the current test site has been fullly loaded, and move to next test
        */
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.details) {
                $scope.currentTest.ip = request.details.ip;
                return;
            }
            chrome.tabs.remove(sender.tab.id);
            loadResult(index, request);
            loadNextTest();
        });
        //move to next test
        function loadNextTest() {
            index++;
            //check if the test is at the end
            if (index == $scope.tests.length) {
                $scope.currentTest = {
                    'name': 'perf',
                    'showName': 'perf',
                    'link': 'Perfomance test. Please wait.'
                };
                $scope.finishedTest.unshift($scope.currentTest);
                $scope.$broadcast('timer-start');
                var a50m = new Array(5e7);
                jslitmus.test('Join 50M', function() {
                    a50m.join(' ');
                });
                jslitmus.on('complete', function(test) {
                    $scope.currentTest.time = test.time * 1000;
                    user_info.performance = test.time * 1000;
                    $scope.currentTest = undefined;
                    $("#currentTest").text("Finish");
                    $scope.$broadcast('timer-stop');
                    $scope.status = "Run Again";
                    finalizeTest();
                });
                // Run the tests
                $timeout(function() {
                    jslitmus.runAll();
                }, 100);
                return;
            }
            $scope.currentTest = $scope.tests[index];
            $scope.finishedTest.unshift($scope.currentTest);
            $scope.$broadcast('timer-start');
            chrome.tabs.create({
                url: $scope.currentTest.link,
                active: false
            }, function(tab) {
                $scope.currentTest.tab = tab;
                chrome.tabs.executeScript(tab.id, {
                    file: "js/helper.js"
                })
            });
            $scope.$digest();
        }
        /*
        format individual test result
            para:
                index: index for test
                data: object containing timing and resource
        */
        function loadResult(index, data) {
            $scope.upData[$scope.tests[index]["name"]] = {
                time: data.time,
                ip: $scope.finishedTest[index].ip
            };
            $scope.finishedTest[0].time = data.time.loadEventEnd - data.time.navigationStart;
            $scope.finishedTest[0].data = data;

            var testRef = $scope.finishedTest[0];
            $http.get('http://ip-api.com/json/' + testRef.ip).success(function(response) {
                var distance = distanceOnUnitSphere(response.lat, response.lon, user_info.ip.lat, user_info.ip.lon);
                testRef.speed = 2 * distance / 299792458 * 1000;

            });
        }

        function distanceOnUnitSphere(lat1, long1, lat2, long2) {
            var degreeToRadians = Math.PI / 180.0;

            var phi1 = (90.0 - lat1) * degreeToRadians;
            var phi2 = (90.0 - lat2) * degreeToRadians;

            var theta1 = long1 * degreeToRadians;
            var theta2 = long2 * degreeToRadians;

            var cos = (Math.sin(phi1) * Math.sin(phi2) * Math.cos(theta1 - theta2) + Math.cos(phi1) * Math.cos(phi2));
            var arc = Math.acos(cos);

            return arc * 6373000;
        }

        function finalizeTest() {
            //upload test timing data and user info
            $scope.upData.user_info = user_info;
            entry_point = fb.child('individuals').push(angular.copy($scope.upData));
            $http.get('http://ip-api.com/json').success(function(response) {
                //somewhere wierd code fails without this call
            });
            //retrieve previous test result from localstorage
            $scope.history = store.get('history');
            $scope.generateReport();
            $('.test:not(:first)').popup({
                content: 'Click for more info'
            });
        }
        /**
         *generate report based on your test result and others' result
         *@param
         *  uTotal: User total loading time
         *  oTotal: Global users loading time 
         *  speedOfLight: User speed of light  
         */
        $scope.generateReport = function() {
            //User total loading time
            var uTotal = 0;
            //Global users loading time
            var oTotal = $scope.total.median;
            //User speed of light 
            var speedOfLight = 0;
            angular.forEach($scope.finishedTest, function(value, key) {
                if (value.name == "perf") {
                    return;
                }
                uTotal += value.time;
                if (!isNaN(value.speed)) {
                    speedOfLight += value.speed;
                }
            });

            function compare(a, b) {
                var temp = (a - b) / b * 100;
                temp = Math.round(temp);
                return temp >= 0 ? {
                    "key": "more time",
                    "value": temp
                } : {
                    "key": "less time",
                    "value": -temp
                }
            }
            var comparation = compare(uTotal, oTotal);
            $scope.report["summary"] = {
                "uTotal": Math.round(uTotal) / 1000,
                "oTotal": Math.round(oTotal) / 1000,
                "comparation": comparation,
            }

            //draw overview graph
            var maxRange = 0;
            var data1 = [
                ['Result', 'Seconds', {
                    role: 'style'
                }, {
                    role: 'annotation'
                }]
            ];

            data1.push(['Your result', parseFloat($filter('number')(uTotal / 1000, 1)), "blueviolet", parseFloat($filter('number')(uTotal / 1000, 1)) + "s"]);
            data1.push(['Global users', parseFloat($filter('number')(oTotal / 1000, 1)), "lightGray", parseFloat($filter('number')(oTotal / 1000, 1)) + "s"]);
            data1.push([user_info.ip.city + " users", parseFloat($filter('number')($scope.region.median / 1000, 1)), "lightGray", parseFloat($filter('number')($scope.region.median / 1000, 1)) + "s"]);
            data1.push(['Hypothetical speed-of-light Internet', parseFloat($filter('number')(speedOfLight / 1000, 3)), "lightGray", parseFloat($filter('number')(speedOfLight / 1000, 3)) + "s"]);

            //find max data
            for (var i = 1; i < data1.length; i++){
                maxRange = Math.max(maxRange, data1[i][1]);
            }

            //store data into localstorage
            var temp = angular.copy($scope.history);
            if (temp == undefined) {
                temp = [];
            }
            if (temp.length == 10) {
                a.shift();
            }
            temp.push({
                user_info: user_info,
                time: Math.round(uTotal) / 1000
            });
            store.set('history', temp);

            //draw graph of ISP in same region
            var data2 = [
                ['ISP', 'Seconds', {
                    role: 'style'
                }, {
                    role: 'annotation'
                }]
            ];

            if ($scope.region[user_info.ip.isp] == undefined) {
                $scope.region[user_info.ip.isp] = {
                    "median": uTotal,
                    "count": 1
                }
            }

            //the fastest ip in user region
            var fastest = null;
            $scope.region.count = 0;

            angular.forEach($scope.region, function(value, key) {
                if (key != "count" && key != "median") {
                    if (fastest == null) {
                        fastest = key;
                    } else if ($scope.region[fastest].median > value.median) {
                        fastest = key;
                    }
                    $scope.region.count += 1;
                    data2.push([key, parseFloat($filter('number')(value.median / 1000, 1)), user_info.ip.isp == key ? "blueviolet" : "lightGray", parseFloat($filter('number')(value.median / 1000, 1)) + "s"])
                }
            });

            //find max data
            for (var i = 1; i < data2.length; i++){
                maxRange = Math.max(maxRange, data2[i][1]);
            }
            maxRange = Math.ceil(maxRange);

            drawChart('chart_total', '', data1, maxRange);
            drawChart('chart_isp', '', data2, maxRange);

            //Get speed comparation value 
            comparation = compare(uTotal, $scope.region.median);
            var fastestComparation = compare($scope.region[fastest].median, uTotal);
            $scope.report["region"] = {
                fastest: fastest,
                comparation: comparation,
                fastestComparation: fastestComparation,

            }

            $scope.fb = {
                city: user_info.ip.city,
                region: user_info.ip.region,
                country: user_info.ip.country
            }
            $('.selection.dropdown').dropdown();

            //Evaluate the grade for network
	
            var isUsingFastestISP = user_info.ip.isp == fastest;
            var fastestISPMedian = $scope.region[fastest].median; // use the fastest ISP in the region to compare
            var regionMedianRatio = uTotal / fastestISPMedian;
            var globalMedianRatio = uTotal / oTotal;

	    if (isUsingFastestISP) {
	    	if (globalMedianRatio > 2) $scope.report.grade = 'D1';
	    	else if (globalMedianRatio > 1.5) $scope.report.grade = 'C1';
	        else if (globalMedianRatio > 1.2) $scope.report.grade = 'B1';
	        else if (globalMedianRatio > 0.9) $scope.report.grade = 'A';
	        else $scope.report.grade = 'A1';
	    } else {
	            if (regionMedianRatio > 1.5) {
	                if (globalMedianRatio > 1.5) $scope.report.grade = 'D1';
	                else $scope.report.grade = 'C1'; // C1 means switching ISP could help (while C => probably not)
	            } else if (regionMedianRatio > 1.15 && regionMedianRatio <= 1.5) {
	                if (globalMedianRatio > 1.25) $scope.report.grade = 'C1';
	                else $scope.report.grade = 'B1'; // B1 means switching ISP could help (while B => probably not)
	            } else if (regionMedianRatio > 0.9 && regionMedianRatio <= 1.15) {
	                if (globalMedianRatio > 1.5) $scope.report.grade = 'C';
	                else if (globalMedianRatio > 1.25) $scope.report.grade = 'B';
	                else $scope.report.grade = 'A';
	            } else {
	                if (globalMedianRatio > 1.25) $scope.report.grade = 'B';
	                else $scope.report.grade = 'A';
	            }
	    }
        }

        //draw bar graph for speed comparasion 
        function drawChart(id, title, d, maxRange) {
            var data = google.visualization.arrayToDataTable(d);
            var view = new google.visualization.DataView(data);

            var options = {
                title: title,
                legend: {
                    position: "none"
                },
                bar: {
                    groupWidth: '70%'
                },
                hAxis: {
                    baseline: 0,
                    textPosition: 'none',
                    maxValue: maxRange,
                    gridlines: {
                        color: 'transparent'
                    }
                },
                height: d.length * 40,
                width: window.outerWidth - 200 - 4 * parseInt($(".message").css("padding")),
                chartArea: {
                    top: "5%",
                    left: '35%',
                    width: '60%',
                    height: '100%'
                },
                enableInteractivity: "false",
                tooltip: {
                    trigger: 'none'
                },
                annotations: {
                    alwaysOutside: true
                }
            };
            var chart = new google.visualization.BarChart(document.getElementById(id));
            chart.draw(view, options);
        };

        //show past results
        $scope.showHistory = function() {
            $scope.modal = "partials/history.html";
            $timeout(function() {
                $('.history.modal').modal('show');
                var isps = {};
                angular.forEach($scope.history, function(value, key) {
                    if (isps[value.user_info.ip.isp]) {
                        isps[value.user_info.ip.isp].push([value.user_info.date, value.time]);
                    } else {
                        isps[value.user_info.ip.isp] = [
                            [value.user_info.date, value.time]
                        ]
                    }
                });
                var columns = ["time"];
                for (var isp in isps) {
                    columns.push(isp);
                }
                var rows = [columns];
                var count = 0;
                for (var isp in isps) {
                    var value = isps[isp];
                    for (var test in value) {
                        var temp = new Date(value[test][0]);
                        var time;
                        if (temp.getDay() < 10) {
                            time = temp.getMonth() + 1 + '.0' + temp.getDay();
                        } else {
                            time = temp.getMonth() + 1 + '.' + temp.getDay();
                        }
                        var row = [parseFloat(time)];
                        for (var i = 0; i < count; i++) {
                            row.push(null);
                        }
                        row.push(value[test][1]);
                        for (var i = 0; i < columns.length - count - 2; i++) {
                            row.push(null);
                        }
                        rows.push(row);
                    }
                    count++;
                }

                //draw the scatter chart 
                var data = google.visualization.arrayToDataTable(rows);
                var options = {
                    title: 'Previous Test Performance',
                    hAxis: {
                        title: 'Date'
                    },
                    vAxis: {
                        title: 'Finish Time(seconds)'
                    }
                };

                var chart = new google.visualization.ScatterChart(document.getElementById('chart_history'));
                chart.draw(data, options);
            }, 100);
        };

        //select individual test for showing menu 
        $scope.selectTest = function(test) {
            $scope.selectedTest = $scope.selectedTest == test ? null : test;
        }

        //show timeline for individual test result
        $scope.showResource = function(test) {
            if (test.name == "perf") {
                return;
            }
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

        $scope.submitFeedback = function(){
            $scope.fb.network = $('input[name="network"]:checked').val();
            $scope.fb.country = $('.selection.dropdown').dropdown('get value');
            entry_point.child('user_info/feedback').set(angular.copy($scope.fb));
            $scope.formSubmitted = true;
        }

        $scope.$watch('fb.comments', function(){
            if ($scope.fb && $scope.fb.comments.length > 1000){
                $scope.fb.comments = $scope.fb.comments.slice(0, 1000);
            }
        })

        $scope.absDiff = function(t1, t2) {
            return Math.abs(t1 - t2) > 1000
        }
    });
