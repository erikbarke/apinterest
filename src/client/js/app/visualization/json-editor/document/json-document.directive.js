(function() {

    'use strict';

    angular
        .module('apinterest.visualization.json-editor')
        .directive('jsonDocument', JsonDocument);

    JsonDocument.$inject = ['$compile', 'JsonDocumentService'];

    function JsonDocument($compile, jsonDocumentService) {

        return {
            restrict: 'A',
            scope: {
                model: '=model',
                name: '=name',
                validators: '=validators'
            },
            link: link
        };

        function link(scope, element) {

            scope.$watch('model', function() {

                createDocument(scope, element);
            });

            createDocument(scope, element);
        }

        function createDocument(scope, element) {

            if (scope.model.value !== undefined && scope.model.value !== null) {

                var html = jsonDocumentService.createHtml(scope.model.value, scope.name, scope.validators);
                element.html(html);
                $compile(element.contents())(scope);
            }
        }
    }
})();
