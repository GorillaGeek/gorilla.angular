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