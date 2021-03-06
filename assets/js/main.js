var App = angular.module('currency-app', ['ui.bootstrap']);

App.directive("content", function(){
	return {
		restrict: 'E',
		templateUrl: 'assets/views/content.html'
	};
});


App.directive("headline", function(){
	return {
		restrict: 'E',
		templateUrl: 'assets/views/headline.html'
	};
});

App.directive("widget", function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            widgetData: '=',
            conversionCall: '&',
            changeUnitCall: '&'
        },
        templateUrl: 'assets/views/widget.html'
    };
});

App.directive("widgetDisclaimer", function(){
    return {
        restrict: 'E',
        templateUrl: 'assets/views/widget-disclaimer.html'
    };
});

App.factory("HttpHelper", function($http, $q, $rootScope) {
	return function() {
		this.getReturnObject = function(url,  objName) {
            var obj = null;
            var deferred = $q.defer();

            var req = {
                method: "GET",
                url: url,
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            };

            $http(req)
            	.then(function(data){
                    obj = objName ? data[objName] : data;
                    deferred.resolve(obj);
            	}, function(data, status){
                    console.log("error");
                    console.log(data);
                    console.log(status);
                    deferred.reject;
            	});

            return deferred.promise;
        };
    };
});