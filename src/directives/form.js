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