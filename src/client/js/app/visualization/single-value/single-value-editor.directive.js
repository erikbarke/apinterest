(function() {

    'use strict';

    angular
        .module('apinterest.single-value')
        .directive('singleValueEditor', SingleValueEditor);

    function SingleValueEditor() {

        return {
            restrict: 'A',
            require: '^form',
            scope: {
                model: '=model',
                name: '=name',
                validator: '=validator'
            },
            templateUrl: 'apinterest/content/js/app/visualization/single-value/single-value-editor.html',
            link: function(scope, element, attributes, ngForm) {

                scope.form = ngForm;

                if (scope.validator) {

                    scope.dropdownValues = scope.validator.values ? scope.validator.values : [false, true];
                }
            }
        };
    }
})();
