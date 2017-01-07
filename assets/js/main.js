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

/*
App.directive("contentCellNormal", function(){
	return {
		restrict: 'E',
		templateUrl: 'assets/views/content_cell_normal.html'
	};
});

App.directive("contentCellExpand", function(){
	return {
		restrict: 'E',
		templateUrl: 'assets/views/content_cell_expand.html'
	};
});

*/