App.controller('currency-ctrl', 
	['$scope','$interval', '$rootScope',  '$window',
	function($scope, $interval, $rootScope, $window){

		$scope.obj = {
			'head_height':0,
			'content_height':0,
			'title':"Currency Converter Widget"
		};

		$scope.respond_to_zoom = function(){
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		}

		$scope.load_page = function() {
			$scope.obj.head_height = $window.innerHeight * 0.3;
			$scope.obj.content_height = $window.innerHeight;
		}
}]);