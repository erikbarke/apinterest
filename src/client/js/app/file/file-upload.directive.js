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

                    addFiles(scope.model, event.target.files);
                });
            });

            function addFiles(model, files) {

                var i;

                model.files = [];

                for (i = 0; i < files.length; i++) {

                    scope.model.files.push({
                        data: files[i],
                        name: files[i].name
                    });
                }
            }
        }
    }
})();
