(function() {

    'use strict';

    angular
        .module('apinterest.common')
        .directive('fileUpload', FileUpload);

    function FileUpload() {

        return {
            restrict: 'A',
            link: link,
            replace: true,
            scope: {
                model: '=model'
            },
            template: '<input type="file" multiple />'
        };

        function link(scope, element) {

            element.bind('change', function(event) {

                scope.model.files = event.target.files;
            });
        }
    }
})();
