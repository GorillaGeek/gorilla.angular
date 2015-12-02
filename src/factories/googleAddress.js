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