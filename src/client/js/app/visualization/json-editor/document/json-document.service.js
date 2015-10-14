(function() {

    'use strict';

    angular
        .module('apinterest.visualization.json-editor')
        .factory('JsonDocumentService', JsonDocumentService);

    function JsonDocumentService() {

        return {
            createHtml: createHtml
        };

        function createHtml(obj, name, validators) {

            function recurse(value, propertyPath, validatorPath) {

                var html = '';

                if (isArray(value)) {

                    html += createArrayHtml(value, propertyPath, validatorPath);
                }
                else if (isObject(value)) {

                    html += createObjectHtml(value, propertyPath, validatorPath);
                }
                else {

                    html += createValueHtml(value, propertyPath, validatorPath);
                }

                return html;
            }

            function createArrayHtml(value, propertyPath, validatorPath) {

                var html = '[',
                    i;

                for (i = 0; i < value.length; i++) {

                    html += '<span class="indented">';
                    html += recurse(value[i], propertyPath + '[' + i + ']', validatorPath);
                    html += i < value.length - 1 ? ',' : '';
                    html += '</span>';
                }

                html += ']';

                return html;
            }

            function createObjectHtml(value, propertyPath, validatorPath) {

                var html = '{',
                    properties = Object.getOwnPropertyNames(value),
                    property,
                    currentPropertyPath,
                    currentValidatorPath,
                    validator,
                    titleAttribute,
                    i;

                for (i = 0; i < properties.length; i++) {

                    property = properties[i];
                    currentPropertyPath = propertyPath + '[\'' + property + '\']';
                    validator = findValidator(validatorPath, property, validators);
                    currentValidatorPath = validator.path;
                    titleAttribute = validator.item && validator.item.type ? ' title="' + validator.item.type + '"' : '';

                    html += '<span class="indented">';
                    html += '<span class="json-property"' + titleAttribute + '>&quot;' + property + '&quot;</span>: ';
                    html += recurse(value[property], currentPropertyPath, currentValidatorPath);
                    html += i < properties.length - 1 ? ',' : '';
                    html += '</span>';
                }

                html += '}';

                return html;
            }

            function createValueHtml(value, propertyPath, validatorPath) {

                var nameAttribute = ' name="' + name + propertyPath + '"',
                    modelAttribute = ' model="model.value' + propertyPath + '"',
                    validator = getValidator(validatorPath, validators),
                    validatorAttribute = validator ? ' validator="validators[' + validators.indexOf(validator) + ']"' : '';

                return '<div class="json-value" json-value-editor' + nameAttribute + modelAttribute + validatorAttribute  + '></div>';
            }

            return recurse(obj, '', '');
        }

        function findValidator(path, property, validators) {

            // fix for HAL formatter adding underscore
            if (property === '_links') {

                property = 'links';
            }

            if (property === '_embedded') {

                property = 'embedded';
            }

            var validatorPath = path + '[\'' + property + '\']',
                validator = getValidator(validatorPath, validators);

            if (!validator) {

                validatorPath = path;
                validator = getValidator(validatorPath, validators);
            }

            return {
                item: validator,
                path: validatorPath
            };
        }

        function getValidator(path, validators) {

            var i;

            for (i = 0; i < validators.length; i++) {

                /* istanbul ignore else */
                if (validators[i].path === path) {

                    return validators[i];
                }
            }

            return undefined;
        }

        function isArray(value) {

            return angular.isArray(value);
        }

        function isObject(value) {

            return angular.isObject(value) && !angular.isArray(value);
        }
    }
})();
