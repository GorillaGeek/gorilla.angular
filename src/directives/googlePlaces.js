(function(angular) {
	"use strict";

	angular.module("gorilla")
		.directive("googlePlaces", ["googleAddress", directive]);

	function directive(GoogleAddress) {

		return {
			restrict: "A",
			scope: {
				callback: "&googlePlaces",
				ngModel: "=",
				address: "="
			},
			link: function(scope, elem) {
				if (!window.google || !window.google.maps || !window.google.maps.places) {
					throw "You need link the google maps js file with places to use google-address directive";
				}

				var autocomplete = new google.maps.places.Autocomplete(elem[0]);
				elem.attr("autocomplete", "off");

				google.maps.event.addListener(autocomplete, "place_changed", function() {
					var place = autocomplete.getPlace();

					if (!place.geometry) {
						return;
					}

					var info = new GoogleAddress(place);

					scope.callback({
						$value: info
					});

					scope.$apply();
				});

				elem.bind('keydown keyup', function(e) {
					var code = e.keyCode || e.which;

					if (code === 13) {
						e.preventDefault();
					}
				});
			}
		};
	}

})(angular);