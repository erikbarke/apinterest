(function() {

    'use strict';

    angular
        .module('apinterest.visualization')
        .directive('valueValidator', ValueValidator);

    function ValueValidator() {

        return {
            require: 'ngModel',
            scope: {
                validator: '=valueValidator'
            },
            link: link
        };

        function link (scope, element, attributes, ngModel) {

            ngModel.$parsers.push (function(value) {

                if (scope.validator === undefined) {

                    return value;
                }

                if (assert(value, scope) && scope.validator.category === 'numeric') {

                    try {

                        return JSON.parse(value);
                    }
                    catch (error) {

                        return value;
                    }
                }

                return value;
            });

            ngModel.$validators.invalidPattern = function(modelValue, viewValue) {

                if (scope.validator === undefined) {

                    return true;
                }

                if (assert(viewValue, scope) && scope.validator.category === 'string') {

                    return scope.validator.pattern.test(viewValue);
                }

                return true;
            };

            ngModel.$validators.invalidNumeric = function(modelValue, viewValue) {

                if (scope.validator === undefined) {

                    return true;
                }

                if (assert(viewValue, scope) && scope.validator.category === 'numeric') {

                    return scope.validator.pattern.test(viewValue) &&
                           modelValue >= scope.validator.minValue &&
                           modelValue <= scope.validator.maxValue;
                }

                return true;
            };
        }

        function assert(viewValue, scope) {

            return viewValue !== null &&
                viewValue !== '' &&
                scope.validator.pattern !== undefined;
        }
    }
})();
