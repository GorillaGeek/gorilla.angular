(function(angular) {
  "use strict";
  angular.module("gorilla", []);
})(angular);
(function(angular) {
    "use strict";
    angular.module("gorilla.bootstrap", ["ui.bootstrap"]);
})(angular);
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
(function(angular) {
    "use strict";

    angular.module("gorilla")
        .directive("datepicker", ["$compile", directive]);

    function directive($compile) {
        return {
            restrict: "A",
            replace: false,
            terminal: true,
            priority: 1000,
            compile: function(element, attrs) {
                var modelName = attrs.ngDatepicker;
                element.attr({
                    "datepicker-popup": "MM/dd/yyyy",
                    "is-open": modelName + "_open",
                    "ng-focus": modelName + "_open = true",
                    "readonly": "readonly",
                    "current-text": "Today",
                    "clear-text": "Clear",
                    "ng-model": modelName
                });

                //Impede crash na pagina
                element.removeAttr("ng-datepicker");

                return {
                    pre: function preLink() {},
                    post: function postLink(scope, iElement) {
                        $compile(iElement)(scope);

                        //seta o valor padrão do input na model
                        var value = element.val();
                        if (value) {
                            //por se datetime a hora pode ter vindo entao remove ela
                            if (value.contains(" ")) {
                                value = value.split(" ")[0];
                            }

                            scope[modelName] = value;
                        }

                        scope.$watch(modelName, function() {
                            element.blur();
                        });
                    }
                };
            },

        };
    }
})(angular);
(function(angular) {
	"use strict";

	angular.module("gorilla")
		.directive("form", directive);

	function directive() {
		return {
			restrict: "E",
			scope: false,
			link: function(scope, elem) {
				scope.form = elem;
			}
		};
	}
})(angular);
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
(function(angular) {
	"use strict";

	angular.module("gorilla")
		.factory("googleAddress", [factory]);

	function factory() {
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

		var fields = {
			address: null,
			addressNumber: null,
			city: null,
			country: null,
			latitude: null,
			local: null,
			longitude: null,
			number: null,
			state: null,
			zipCode: null
		};

		var googleAddress = function(place) {
			angular.extend(this, fields);

			this.latitude = place.geometry.location.lat();
			this.longitude = place.geometry.location.lng();

			for (var i = 0; i < place.address_components.length; i++) {
				var componentInfo = component[place.address_components[i].types[0]] || component[place.address_components[i].types[1]];

				if (!componentInfo) {
					continue;
				}

				this[componentInfo.name] = place.address_components[i][componentInfo.type];
			}

			var address = place.formatted_address.split(",");
			address.pop();

			this.local = address.join(",");
			this.addressNumber = ((this.number || '') + ' ' + this.address).trim();
		};

		return googleAddress;
	}

})(angular);
(function(angular) {
    "use strict";

    angular.module("gorilla")
        .factory("httpFactory", ["$http", factory]);

    function factory($http) {
        return {
            fromForm: function(form) {
                return $http({
                    method: "POST",
                    url: form.attr("action"),
                    data: form.serialize(),
                    headers: {
                        'Content-Type': "application/x-www-form-urlencoded"
                    }
                });
            }
        };
    }

})(angular);
(function(angular) {
    "use strict";

    angular.module("gorilla.bootstrap")
        .controller("gorilla.controllers.modal", ["$scope", "$modalInstance", "$sce", "data", controller]);


    function controller($scope, $modalInstance, $sce, data) {
        $scope.title = data.title;
        $scope.content = $sce.trustAsHtml(data.content);
        $scope.resource = data.resource;
        $scope.showCancel = data.showCancel !== undefined ? data.showCancel : true;
    }

})(angular);
(function(angular) {
    "use strict";

    angular.module("gorilla.bootstrap")
        .service("gorilla.modal", ["$uibModal", service]);

    function service($uibModal) {
        /*jshint validthis:true */

        var template = '<div class="modal-header"><button type="button" class="close" ng-click="$dismiss()"><span aria-hidden="true">&times;</span> </button> <h3 class="modal-title">{{title}}</h3> </div><div class="modal-body confirm-alert" ng-bind-html="content"></div><div class="modal-footer"> <div ng-show="!showCancel"> <button type="button" class="btn btn-success" ng-click="$close()">{{resource.ok}}</button> </div><div ng-show="showCancel"> <button type="button" class="btn btn-success" ng-click="$close()">{{resource.yes}}</button> <button type="button" class="btn btn-default" ng-click="$dismiss()">{{resource.no}}</button> </div></div>';
        var resource = {
            alertTitle: "Alert",
            confirmTitle: "Confirm",
            ok: "Ok",
            yes: "Ok",
            no: "Cancel"
        };

        var openModal = function(title, content, showCancel) {
            return $uibModal.open({
                template: template,
                controller: "gorilla.controllers.modal",
                resolve: {
                    data: function() {
                        return {
                            title: title,
                            content: content,
                            showCancel: showCancel,
                            resource: resource
                        };
                    }
                }
            }).result;
        };

        this.alert = function(content) {
            return openModal(resource.alertTitle, content, false);
        };

        this.confirm = function(content) {
            return openModal(resource.confirmTitle, content, true);
        };

        this.modifyResource = function(newResource) {
            resource = newResource;
        };
    }
})(angular);