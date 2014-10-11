'use strict';
/* Controllers */
angular.module('myApp.controllers', [])
    .controller('TimerCtrl', function($scope, $timeout, $http, $q, $filter) {
        var fb = new Firebase("https://speedtest.firebaseio.com"); //firebase reference
        var index = 0; //index for test
        var user_info = {}; //user information like ip address, web browser, and date
        $scope.tests = [{
            'link': 'http://www.aws.amazon.com/',
            'name': 'aws'
        }, {
            'link': 'http://www.adcash.com/en/index.php',
            'name': 'adcash'
        }, {
            'link': 'http://www.addthis.com/',
            'name': 'addthis'
        }, {
            'link': 'http://www.adf.ly/',
            'name': 'adf'
        }, {
            'link': 'http://www.adobe.com/',
            'name': 'adobe'
        }, {
            'link': 'http://www.badoo.com/',
            'name': 'badoo'
        }, {
            'link': 'http://www.chase.com/',
            'name': 'chase'
        }, {
            'link': 'http://www.conduit.com/',
            'name': 'conduit'
        }, {
            'link': 'http://www.flickr.com',
            'name': 'flickr'
        }, {
            'link': 'http://www.go.com/',
            'name': 'go'
        }];

        $scope.grades = {
            'A': {
                'color': 'red',
                'comment': 'Your network is super fast'
            },
            'B': {
                'color': 'green',
                'comment': 'Your network is good in your area or grobally'
            },
            'C': {
                'color': 'blue',
                'comment': 'Your network is average in your area or grobally'
            },
            'D': {
                'color': 'grey',
                'comment': 'Your network is slower than average'
            }
        }
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

            $scope.userCity = response.city;
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
            $scope.currentTest.time = args.millis;
            $scope.$digest()
            if (args.millis >= 15000) {
                $scope.currentTest.time = $scope.total[$scope.currentTest["name"]];
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
            fb.child('individuals').push(angular.copy($scope.upData));
            $http.get('http://ip-api.com/json').success(function(response) {
                //somewhere wierd code fails without this call
            });
            //retrieve previous test result from localstorage
            $scope.history = store.get('history');
            $scope.generateReport();
            $('.test:not(:first)').popup({
                content: 'Left Click to show more infomation'
            });
        }
        /*
        generate report based on your test result and others' result
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
                if (!isNaN(value.speed)){
                   speedOfLight += value.speed; 
                }
            });

            function compare(a, b) {
                var temp = (a - b) / b * 100;
                temp = Math.round(temp);
                return temp >= 0 ? {
                    "key": "slower",
                    "value": temp
                } : {
                    "key": "faster",
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
            var data = [
                ['Result', 'Seconds', {
                    role: 'style'
                }, {
                    role: 'annotation'
                }]
            ];

            data.push(['Your Result', parseFloat($filter('number')(uTotal / 1000, 1)), "blueviolet", parseFloat($filter('number')(uTotal / 1000, 1)) + "s"]);
            data.push(['Global Users', parseFloat($filter('number')(oTotal / 1000, 1)), "lightGray", parseFloat($filter('number')(oTotal / 1000, 1)) + "s"]);
            data.push([user_info.ip.city + " users", parseFloat($filter('number')($scope.region.median / 1000, 1)), "lightGray", parseFloat($filter('number')($scope.region.median / 1000, 1)) + "s"]);
            data.push(['Speed Of Light', parseFloat($filter('number')(speedOfLight / 1000, 3)), "lightGray", parseFloat($filter('number')(speedOfLight / 1000, 3)) + "s"]);

            drawChart('chart_total', '', data);

            //store data into localstorage
            var temp = angular.copy($scope.history);
            if (temp == undefined) {
                temp = [];
            }
            if (temp.length == 10){
                a.shift();
            } 
            temp.push({
                user_info: user_info,
                time: Math.round(uTotal) / 1000
            });
            store.set('history', temp);

            //draw graph of ISP in same region
            var data = [
                ['ISP', 'Seconds', {
                    role: 'style'
                }, {
                    role: 'annotation'
                }]
            ];

            //the fastest ip in user region
            var fastest = null;
            if ($scope.region[user_info.ip.isp] == undefined) {
                $scope.region[user_info.ip.isp] = {
                    "median": uTotal,
                    "count": 1
                }
            }
            angular.forEach($scope.region, function(value, key) {
                if (key != "count" && key != "median") {
                    if (fastest == null) {
                        fastest = key;
                    } else if ($scope.region[fastest].median > value.median) {
                        fastest = key;
                    }
                    data.push([key, parseFloat($filter('number')(value.median / 1000, 1)), user_info.ip.isp == key ? "blueviolet" : "lightGray", parseFloat($filter('number')(value.median / 1000, 1)) + "s"])
                }
            });
            drawChart('chart_isp', '', data);

            //Get speed comparation value 
            comparation = compare(uTotal, $scope.region.median);
            var fastestComparation = compare($scope.region[fastest].median, uTotal);
            $scope.report["region"] = {
                "fastest": fastest,
                "comparation": comparation,
                "fastestComparation": fastestComparation,

            }

            //calculate speed letter
            var regionMedian = $scope.region.median; //find the median speed in user region
            var weight = (oTotal - uTotal) / oTotal + 2 * (regionMedian - uTotal) / regionMedian;
            if (weight > 1.5) {
                $scope.report.grade = 'A';
            } else if (weight > 0.5) {
                $scope.report.grade = 'B';
            } else if (weight > -0.5) {
                $scope.report.grade = 'C';
            } else {
                $scope.report.grade = 'D';
            }
        }

        //draw bar graph for speed comparasion 
        function drawChart(id, title, d) {
            var data = google.visualization.arrayToDataTable(d);
            var view = new google.visualization.DataView(data);

            var options = {
                title: title,
                legend: {
                    position: "none"
                },
                hAxis: {
                    baseline: 0,
                    maxValue: 60,
                    gridlines: {
                        color: 'transparent'
                    }
                },
                height: d.length * 60,
                width: window.outerWidth - 200 - 4 * parseInt($(".message").css("padding")),
                chartArea: {
                    left: 200,
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

        $scope.absDiff = function(t1, t2) {
            return Math.abs(t1 - t2) > 500
        }
    });