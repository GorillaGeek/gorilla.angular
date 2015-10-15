(function(angular) {
    "use strict";

    angular.module("gorilla")
        .directive("bindElement", [directive]);

    function directive() {
        return {
            restrict: "A",
            scope: false,
            link: function($scope, element, attrs) {
                $scope[attrs.bindElement] = element;
            }
        };
    }
})(angular);