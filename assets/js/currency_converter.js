App.controller('currency-ctrl', 
	['$scope','$interval', '$rootScope',  '$window', 'HttpHelper',
	function($scope, $interval, $rootScope, $window, HttpHelper){

		var httpHelper = new HttpHelper();

		$scope.obj = {
			'content':{
				'content_cell_lower_text':'Here are some products for sale',
				'cells':[
					{'type':1,'price':'129'},
					{'type':2,'price':'69'},
					{'type':2,'price':'99'},
					{'type':1,'price':'19'},
					{'type':2,'price':'349'},
					{'type':1,'price':'219'},
					{'type':1,'price':'159'},
					{'type':2,'price':'189'}
				]
			},
			'currency_converter':{
				'collapsed':true,
				'input':{
					'value':null,
					'unit':'CAD'
				},
				'output':{
					'value':null,
					'unit':'USD'
				},
				'rates':{},
				'disclaimer':{
					'open': false,
					'rate': null,
					'date': null
				}
			},
			'title':"Currency Converter Widget"
		};

	/***********
	Basic layout code
	***********/

		$scope.load_page = function() {
			// Generate each content cell's widget data
			for (var i = $scope.obj.content.cells.length - 1; i >= 0; i--) {
				$scope.obj.content.cells[i].show_widget = false;
				$scope.obj.content.cells[i].widget_data = {
					'input':{
						'value':null,
						'unit':'CAD'
					},
					'output':{
						'value':null,
						'unit':'USD'
					},
					'rates':{}
				};
			}
		}

		$scope.trigger_widget_collapse = function() {
			$scope.obj.currency_converter.collapsed = !$scope.obj.currency_converter.collapsed;
			if ($scope.obj.currency_converter.collapsed) {
				$scope.obj.currency_converter.disclaimer.open = false;
			}
		}

		$scope.trigger_disclaimer = function(){
			$scope.obj.currency_converter.disclaimer.open = !$scope.obj.currency_converter.disclaimer.open;
		}


	/***********
	Currency conversion related code
	***********/
		$scope.change_unit = function(widget_data, is_input, new_unit) {
			if (is_input) {
				widget_data.input.unit = new_unit;
			}else{
				widget_data.output.unit = new_unit;
			}
			/* 
			Here the behavior after unit change is :
				no matter it is the input's unit changed or output's unit changed,
				always do the conversion in the right direction (not reverse),
				this behavior is to follow how google's conversion works.
				See in detail : https://www.google.ca/search?q=cad+to+usd
			*/
			$scope.prepare_conversion(widget_data, false);
		}

		$scope.prepare_conversion = function(widget_data, reverse){
			if (!reverse) {
				$scope.load_exchange_rate(widget_data, $scope.perform_conversion);
			}else{
				$scope.load_exchange_rate(widget_data, $scope.perform_reverse_conversion);
			}
		}

		$scope.load_exchange_rate = function(widget_data, callback) {
			httpHelper.getReturnObject('https://api.fixer.io/latest?base=' + widget_data.input.unit, null).then(function(data) {
				widget_data.rate = data.data;
				if (callback != null) {
					callback(widget_data);
				}
			});
		}

		$scope.perform_conversion = function(widget_data) {
			var input =widget_data.input.value;
			var unit = widget_data.output.unit;
			var rates_json = widget_data.rate.rates;
			if (rates_json != null && rates_json.hasOwnProperty(unit)) {	// Fault tolerance check, in case the JSON model is changed
				var rate = rates_json[unit];
				if (widget_data.hasOwnProperty('disclaimer')) {	// Update disclaim info, if it is the side widget
					widget_data.disclaimer.rate = rate;
					widget_data.disclaimer.date = widget_data.rate.date;
				}
				var result = input * rate;
				result = Math.round(result*100)/100;
				if (result < 0) {	// Fault tolerance check
					result = 0;
				}
			}else{
				result = -1;
			}
			widget_data.output.value = result;
		}

		$scope.perform_reverse_conversion = function(widget_data) {
			var input = widget_data.output.value;
			var unit = widget_data.output.unit;
			var rates_json = widget_data.rate.rates;
			if (rates_json != null && rates_json.hasOwnProperty(unit)) {	// Safe check in case 'unit' is invalid or the JSON model is changed
				var rate = 1 / rates_json[unit];
				var result = input * rate;
				result = Math.round(result*100)/100;
				if (result < 0) {	// Safe check
					result = 0;
				}
			}else{
				result = -1;
			}
			widget_data.input.value = result;
		}


		

}]);