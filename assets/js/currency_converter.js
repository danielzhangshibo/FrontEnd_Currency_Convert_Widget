App.controller('currency-ctrl', 
	['$scope','$interval', '$rootScope',  '$window',
	function($scope, $interval, $rootScope, $window){

		$scope.obj = {
			'content':{
				'content_height':0,
				'left_holder_width':0,
				'right_holder_width':0,
				'content_cell_lower_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in libero dictum, tristique ligula convallis, eleifend nibh. Aliquam sed vulputate justo. ',
			},
			'title':"Currency Converter Widget"
		};

		$scope.respond_to_zoom = function(){
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		}

		$scope.load_page = function() {
			$scope.obj.content.content_height = $window.innerHeight;
			$scope.obj.content.left_holder_width = 16.67;
			$scope.obj.content.right_holder_width = 16.67;
		}
}]);