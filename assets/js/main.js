var App = angular.module('currency-app', []);

App.directive( 'respondToZoom', function($window){
	return {
		link: function( scope, elem, attrs){
			var w = angular.element($window);

			w.bind('resize', function(){
				scope.$eval(attrs.respondToZoom, {'event': event});
			})
		}
	}
})


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

