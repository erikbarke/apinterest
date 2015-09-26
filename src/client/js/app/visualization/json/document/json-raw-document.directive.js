(function() {

    'use strict';

    angular
        .module('apinterest.json-editor')
        .directive('jsonRawDocument', JsonRawDocument);

    function JsonRawDocument() {

        return {
            require: 'ngModel',
            link: link
        };

        function link (scope, element, attributes, ngModel) {

            ngModel.$render = function() {

                element.html(JSON.stringify(ngModel.$viewValue, null, 2));
            };

            element.on('keydown keyup change paste', function() {

                scope.$evalAsync(function() {

                    try {

                        scope.jsonParseError = null;
                        ngModel.$setViewValue(JSON.parse(element.text()));
                        ngModel.$setValidity(scope.name, true);
                    }
                    catch (error) {

                        ngModel.$setValidity(scope.name, false);
                        scope.jsonParseError = error.message;
                    }
                });
            });
        }
    }
})();
