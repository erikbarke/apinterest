(function() {

    'use strict';

    angular
        .module('apinterest.common')
        .directive('fileUpload', FileUpload);

    function FileUpload() {

        return {
            restrict: 'A',
            link: link,
            scope: {
                model: '=model'
            },
            template: '<input type="file" multiple />'
        };

        function link(scope, element) {

            var input = angular.element(element[0].firstElementChild);

            input.bind('change', function() {

                scope.model.files = input[0].files;
            });
        }
    }
})();
