App.controller('currency-ctrl', 
	['$scope','$interval', '$rootScope',  '$window', 'HttpHelper',
	function($scope, $interval, $rootScope, $window, HttpHelper){

		var httpHelper = new HttpHelper();

		$scope.obj = {
			'content':{
				'content_height':0,
				'left_holder_width':0,
				'right_holder_width':0,
				'content_cell_lower_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in libero dictum, tristique ligula convallis, eleifend nibh. Aliquam sed vulputate justo. ',
			},
			'currency_converter':{
				'input':{
					'value':null,
					'unit':'CAD'
				},
				'output':{
					'value':null,
					'unit':'USD'
				},
				'rate':{}
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
			$scope.obj.content.left_holder_width = 1* 100/12;		// equals to col-1 in bootstrap
			$scope.obj.content.right_holder_width = 3* 100/12;		// equals to col-3 in bottstrap
			$scope.load_exchange_rate();
		}

		$scope.load_exchange_rate = function() {
			httpHelper.getReturnObject('http://api.fixer.io/latest?base=' + $scope.obj.currency_converter.input.unit, null).then(function(data) {
				$scope.obj.currency_converter.rate = data.data;
			});
		}

		$scope.perform_conversion = function() {
			var input = $scope.obj.currency_converter.input.value;
			var unit = $scope.obj.currency_converter.output.unit;
			var rates_json = $scope.obj.currency_converter.rate.rates;
			if (rates_json != null && rates_json.hasOwnProperty(unit)) {	// Safe check in case the JSON model is changed
				var rate = rates_json[unit];
				var result = input * rate;
				result = Math.round(result*100)/100;
				if (result < 0) {	// Safe check
					result = 0;
				}
			}else{
				result = -1;
				$scope.obj.test = $scope.obj.currency_converter.rate;
			}
			$scope.obj.currency_converter.output.value = result;
		}

		$scope.perform_invert_conversion = function() {
			var input = $scope.obj.currency_converter.output.value;
			var unit = $scope.obj.currency_converter.output.unit;
			var rates_json = $scope.obj.currency_converter.rate.rates;
			if (rates_json != null && rates_json.hasOwnProperty(unit)) {	// Safe check in case the JSON model is changed
				var rate = 1 / rates_json[unit];
				var result = input * rate;
				result = Math.round(result*100)/100;
				if (result < 0) {	// Safe check
					result = 0;
				}
			}else{
				result = -1;
				$scope.obj.test = $scope.obj.currency_converter.rate;
			}
			$scope.obj.currency_converter.input.value = result;
		}
}]);