'use strict';

/* Controllers */
google.load("visualization", "1", {
    packages: ["corechart"]
});

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

        $scope.total = null; //total speed statics  
        $scope.region = null; //speed statics in same region 
        $scope.status = "Start Test";

        //load statics to total
        fb.child("total").once("value", function(dataSnapshot) {
            $scope.total = dataSnapshot.val();
            $scope.$digest();
        });

        //get user ip address and load statics to isp and region
        $http.get('http://ip-api.com/json').success(function(response) {
            //map city 
            if (response.city == ""){
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
            fb.child("region/" + response.city).once("value", function(dataSnapshot) {
                $scope.region = dataSnapshot.val();
                $scope.$digest();
            });

        })

        $scope.startTest = function() {
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
                $scope.currentTest.time = 15000;
                $scope.upData[$scope.currentTest["name"]] = {
                    time: {
                        status: "timeout",
                        loadEventEnd: 15000,
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
                $scope.currentTest = undefined;
                $("#currentTest").text("Finish");
                $scope.$broadcast('timer-stop');
                $scope.status = "Run Again";

                finalizeTest();
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

            $('.test').popup({
                content: 'Click me to show more infomation'
            });

        }

        /*
            generate report based on your test result and others' result
        */
        $scope.generateReport = function() {
            var uTotal = 0;
            var oTotal = $scope.total.median;
            angular.forEach($scope.finishedTest, function(value, key) {
                uTotal += value.time;
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
                }]
            ];
            data.push(['Your Result', parseFloat($filter('number')(uTotal / 1000, 1)), "green"]);
            data.push(['Global Users', parseFloat($filter('number')(oTotal / 1000, 1)), "grey"]);
            data.push([user_info.ip.city + " users", parseFloat($filter('number')($scope.region.median / 1000, 1)), "grey"]);

            drawChart('chart_total', '', data);

            //store data into localstorage 
            var temp = angular.copy($scope.history);
            if (temp == undefined) {
                temp = [];
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
                }]
            ];
            oTotal = $scope.region.median;

            angular.forEach($scope.region, function(value, key) {
                if (key != "count" && key != "median") {
                    data.push([key, parseFloat($filter('number')(value.median / 1000, 1)), user_info.ip.isp == key ? "green" : "grey"])
                }
            });
            comparation = compare(uTotal, oTotal);
            $scope.report["region"] = {
                "uTotal": Math.round(uTotal) / 1000,
                "oTotal": Math.round(oTotal) / 1000,
                "comparation": comparation,
            }
            drawChart('chart_isp', 'ISP in Your Region', data);
        }

        function drawChart(id, title, d) {
            var data = google.visualization.arrayToDataTable(d);
            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1, {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2
            ]);
            var options = {
                title: title,
                legend: {
                    position: "none"
                },
                hAxis: {
                    title: "seconds",
                    baseline: 0
                },
                width: window.outerWidth - 200 - 2 * parseInt($(".message").css("padding")),
                chartArea: {
                    left: 200,
                },
                backgroundColor: "#EFEFEF",
                tooltip: {
                    trigger: 'none'
                }
            };

            var chart = new google.visualization.BarChart(document.getElementById(id));
            chart.draw(view, options);
        };

        $scope.showHistory = function() {
            $scope.modal = "partials/history.html";
            $timeout(function() {
                $('.modal').modal('show');
            }, 100);
        };

        //show timeline for individual test result 
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

        $scope.absDiff = function(t1, t2) {
            return Math.abs(t1 - t2) > 200
        }

    });