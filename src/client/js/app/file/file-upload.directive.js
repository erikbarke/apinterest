(function() {

    'use strict';

    angular
        .module('apinterest.file')
        .directive('fileUpload', FileUpload);

    FileUpload.$inject = ['$compile'];

    function FileUpload($compile) {

        return {
            restrict: 'A',
            link: link,
            replace: true,
            scope: {
                model: '=model'
            }
        };

        function link(scope, element) {

            scope.$watch('model', function() {

                element.html('<input type="file" multiple />');
                $compile(element.contents())(scope);

                element.bind('change', function(event) {

                    scope.model.files = event.target.files;
                });
            });
        }
    }
})();
