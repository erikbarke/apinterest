(function() {

    'use strict';

    angular
        .module('apinterest.json-editor')
        .directive('jsonEditor', JsonEditor);

    function JsonEditor() {

        return {
            restrict: 'A',
            require: '^form',
            scope: {
                model: '=model',
                name: '=name',
                validators: '=validators'
            },
            templateUrl: 'apinterest/content/js/app/visualization/json/json-editor.html',
            link: function(scope, element, attributes, ngForm) {

                scope.form = ngForm;
                scope.activeTab = 'editor';
            }
        };
    }
})();
