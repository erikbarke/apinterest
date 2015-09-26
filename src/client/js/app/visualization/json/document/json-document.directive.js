(function() {

    'use strict';

    angular
        .module('apinterest.json-editor')
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

            var html;

            if (scope.model.value !== undefined && scope.model.value !== null) {

                html = jsonDocumentService.createHtml(scope.model.value, scope.name, scope.validators);
                element.html(html);
                $compile(element.contents())(scope);
            }
        }
    }
})();
