(function(angular) {
    "use strict";

    angular.module("gorilla")
        .directive("googlePlaces", [directive]);

    function directive() {

        if (!window.google) {
            $.getScript("https://maps.googleapis.com/maps/api/js?libraries=places&callback=callbackGoogleMaps");
            window.callbackGoogleMaps = function() {};
        }

        return {
            restrict: "A",
            scope: {
                callback: "&googlePlaces",
                ngModel: "="
            },
            link: function(scope, elem) {
                scope.window = window;

                scope.$watch("window.google", function(google) {
                    if (!google) return;

                    var autocomplete = new google.maps.places.Autocomplete(elem[0]);
                    elem.attr("autocomplete", "off");

                    var component = {
                        street_number: {
                            name: 'number',
                            type: 'short_name'
                        },
                        route: {
                            name: 'address',
                            type: 'long_name'
                        },
                        locality: {
                            name: 'city',
                            type: 'long_name'
                        },
                        administrative_area_level_1: {
                            name: 'state',
                            type: 'short_name'
                        },
                        postal_code: {
                            name: 'zipCode',
                            type: 'short_name'
                        },
                        neighborhood: {
                            name: 'neighborhood',
                            type: 'short_name'
                        },
                        country: {
                            name: 'country',
                            type: 'short_name'
                        }
                    };

                    google.maps.event.addListener(autocomplete, "place_changed", function() {
                        var place = autocomplete.getPlace();

                        if (!place.geometry) {
                            return;
                        }

                        var info = {
                            local: place.formatted_address,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng()
                        };

                        for (var i = 0; i < place.address_components.length; i++) {
                            var componentInfo = component[place.address_components[i].types[0]];

                            if (!componentInfo) {
                                continue;
                            }

                            info[componentInfo.name] = place.address_components[i][componentInfo.type];
                        }

                        scope.ngModel = place.formatted_address;

                        scope.callback({
                            $value: info
                        });
                        scope.$apply();
                    });

                    elem.keydown(function(e) {
                        var code = e.keyCode || e.which;

                        if (code === 13) {
                            e.preventDefault();
                        }
                    });

                });
            }
        };
    }

})(angular);