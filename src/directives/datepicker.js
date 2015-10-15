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