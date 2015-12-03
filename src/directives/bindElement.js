(function(angular) {
	"use strict";

	angular.module("gorilla")
		.directive("bindElement", ["$parse", directive]);

	function directive($parse) {
		return {
			restrict: "A",
			scope: false,
			link: function($scope, element, attrs) {
				var model = $parse(attrs.bindElement);
				eval("delete $scope." + attrs.bindElement); // jshint ignore:line
				model.assign($scope, element);
			}
		};
	}
})(angular);