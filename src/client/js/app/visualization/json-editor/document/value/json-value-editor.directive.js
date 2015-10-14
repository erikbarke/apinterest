(function() {

    'use strict';

    angular
        .module('apinterest.visualization.json-editor')
        .directive('jsonValueEditor', JsonValueEditor);

    JsonValueEditor.$inject = ['$timeout'];

    function JsonValueEditor($timeout) {

        var enterKey = 13;

        return {
            restrict: 'A',
            require: '^?form',
            scope: {
                model: '=model',
                name: '@name',
                validator: '=validator'
            },
            templateUrl: 'apinterest/content/js/app/visualization/json-editor/document/value/json-value-editor.html',
            link: link
        };

        function link (scope, element, attributes, ngForm) {

            scope.form = ngForm;
            scope.getPlaceholder = getPlaceholder;

            scope.setModel = function(value) {

                scope.model = value;
            };

            scope.togglePopup = function() {

                scope.popupVisible = !scope.popupVisible;

                setInputCaretPosition(element);
            };

            scope.closePopup = function() {

                scope.popupVisible = false;
            };

            scope.getLeftQuote = function(model) {

                return getQuote(scope, model, '<');
            };

            scope.getRightQuote = function(model) {

                return getQuote(scope, model, '>');
            };

            if (scope.validator !== undefined) {

                scope.dropdownValues = scope.validator.values ? scope.validator.values : [false, true];
            }

            addCloseOnEnter(element, scope);
        }

        function setInputCaretPosition(element) {

            $timeout(function() {

                var input = element.find('input'),
                    length = input.val().length;

                input[0].setSelectionRange(length, length);
                input[0].focus();
            });
        }

        function addCloseOnEnter(element, scope) {

            element.on('keypress', function(e) {

                if (e.keyCode === enterKey) {

                    scope.$evalAsync(scope.closePopup);
                    e.stopPropagation();
                    e.preventDefault();

                    return false;
                }

                return true;
            });
        }

        function getPlaceholder(model) {

            if (model === undefined) {

                return 'invalid';
            }

            if (model === null) {

                return 'null';
            }

            if (model === '') {

                return 'empty';
            }

            return '';
        }

        function getQuote(scope, model, bracket) {

            if (model === undefined || model === '') {

                return bracket;
            }

            if (model === null) {

                return '';
            }

            if (scope.validator !== undefined && scope.validator.category === 'string') {

                return '"';
            }

            return '';
        }
    }
})();
