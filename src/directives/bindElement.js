(function(angular) {
    "use strict";

    angular.module("gorilla", [])
        .directive("bindElement", [directive]);

    function directive() {
        return {
            restrict: "A",
            scope: {
                bindElement: "="
            },
            link: function($scope, element) {
                $scope.bindElement = element;
            }
        };
    }
})(angular);