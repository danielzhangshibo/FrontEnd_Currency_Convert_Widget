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
				'collapsed':false,
				'width': 20,
				'right': 2,
				'top': 40,
				'input':{
					'value':null,
					'unit':'CAD'
				},
				'output':{
					'value':null,
					'unit':'USD'
				},
				'rates':{}
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
			$scope.expand_widget();
			$scope.load_exchange_rate();
		}

		$scope.load_exchange_rate = function(callback) {
			httpHelper.getReturnObject('http://api.fixer.io/latest?base=' + $scope.obj.currency_converter.input.unit, null).then(function(data) {
				$scope.obj.currency_converter.rate = data.data;
				if (callback != null) {
					callback();
				}
			});
		}
		
		$scope.prepare_conversion = function(reverse){
			if (reverse == false) {
				$scope.load_exchange_rate($scope.perform_conversion);
			}else{
				$scope.load_exchange_rate($scope.perform_reverse_conversion);
			}
		}

		$scope.perform_conversion = function() {
			var input = $scope.obj.currency_converter.input.value;
			var unit = $scope.obj.currency_converter.output.unit;
			var rates_json = $scope.obj.currency_converter.rate.rates;
			if (rates_json != null && rates_json.hasOwnProperty(unit)) {	// Fault tolerance check, in case the JSON model is changed
				var rate = rates_json[unit];
				var result = input * rate;
				result = Math.round(result*100)/100;
				if (result < 0) {	// Fault tolerance check
					result = 0;
				}
			}else{
				result = -1;
				$scope.obj.test = $scope.obj.currency_converter.rate;
			}
			$scope.obj.currency_converter.output.value = result;
		}

		$scope.perform_reverse_conversion = function() {
			var input = $scope.obj.currency_converter.output.value;
			var unit = $scope.obj.currency_converter.output.unit;
			var rates_json = $scope.obj.currency_converter.rate.rates;
			if (rates_json != null && rates_json.hasOwnProperty(unit)) {	// Safe check in case 'unit' is invalid or the JSON model is changed
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

		$scope.change_unit = function(is_input, new_unit) {
			if (is_input) {
				$scope.obj.currency_converter.input.unit = new_unit;
			}else{
				$scope.obj.currency_converter.output.unit = new_unit;
			}
			/* 
			Here the behavior after unit change is :
				no matter it is the input's unit changed or output's unit changed,
				always do the conversion in the right direction (not reverse),
				this behavior is to follow how google's conversion works.
				See in detail : https://www.google.ca/search?q=cad+to+usd
			*/
			$scope.prepare_conversion(false);
		}

		$scope.collapse_widget = function() {
			$scope.obj.currency_converter.width = null;
			$scope.obj.currency_converter.right = 0;
			$scope.obj.currency_converter.top = 40;
			$scope.obj.currency_converter.collapsed = true;
			$scope.obj.content.left_holder_width = 2* 100/12;		// equals to col-2 in bootstrap
			$scope.obj.content.right_holder_width = 2* 100/12;		// equals to col-2 in bottstrap
		}

		$scope.expand_widget = function() {
			$scope.obj.currency_converter.width = 20;
			$scope.obj.currency_converter.right = 2;
			$scope.obj.currency_converter.top = 40;
			$scope.obj.currency_converter.collapsed = false;
			$scope.obj.content.left_holder_width = 1* 100/12;		// equals to col-1 in bootstrap
			$scope.obj.content.right_holder_width = 3* 100/12;		// equals to col-3 in bottstrap
		}

}]);