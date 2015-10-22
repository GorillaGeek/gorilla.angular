(function(angular) {
    "use strict";

    angular.module("gorilla.bootstrap")
        .service("gorilla.modal", ["$uibModal", service]);

    function service($uibModal) {
        /*jshint validthis:true */

        var template = '<div class="modal-header"><button type="button" class="close" ng-click="$dismiss()"> <span aria-hidden="true">&times;</span> </button> <h3 class="modal-title">{{title}}</h3> </div><div class="modal-body confirm-alert" ng-bind-html="content"></div><div class="modal-footer"> <div ng-show="!showCancel"> <button type="button" class="btn btn-success btn-addon" ng-click="$close()"> <i class="fa fa-check"></i>{{resource.ok}}</button> </div><div ng-show="showCancel"> <button type="button" class="btn btn-success btn-addon" ng-click="$close()"> <i class="fa fa-check"></i>{{resource.yes}}</button> <button type="button" class="btn btn-danger btn-addon" ng-click="$dismiss()"> <i class="fa fa-times"></i>{{resource.no}}</button> </div></div>';
        var resource = {
            alertTitle: "Alert",
            confirmTitle: "Confirm",
            ok: "Ok",
            yes: "Yes",
            no: "no"
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