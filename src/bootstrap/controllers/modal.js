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