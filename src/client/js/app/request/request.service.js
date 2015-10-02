(function() {

    'use strict';

    angular
        .module('apinterest.request')
        .factory('RequestService', RequestService);

    RequestService.$inject = ['PathModelService', 'StorageService'];

    function RequestService(pathModelService, storageService) {

        return {
            createRequestRunnerModel: createRequestRunnerModel
        };

        function createRequestRunnerModel(routeDescription) {

            var parameters = createParameters(routeDescription),
                credentials = storageService.getUserCredentials(routeDescription.relativePath);

            return {
                path: routeDescription.relativePath,
                pathModel: pathModelService.getModel(routeDescription.relativePath, parameters),
                httpMethod: routeDescription.httpMethod,
                requiresAuthorization: routeDescription.requiresAuthorization,
                username: credentials.username,
                password: credentials.password,
                parameters: parameters,
                response: getResponse(routeDescription)
            };
        }

        function createParameters(routeDescription) {

            var parameters = [],
                parameter,
                value,
                i;

            for (i = 0; i < routeDescription.parameters.length; i++) {

                value = routeDescription.parameters[i].sample;

                parameter = {
                    source: routeDescription.parameters[i].source,
                    name: routeDescription.parameters[i].name,
                    displayName: routeDescription.parameters[i].source + ' {' + routeDescription.parameters[i].name + '}',
                    type: routeDescription.parameters[i].type,
                    category: routeDescription.parameters[i].category,
                    value: value,
                    validators: getValidators(routeDescription.parameters[i]),
                    visualizationType: getVisualizationType(value)
                };

                parameters.push(parameter);
            }

            return parameters;
        }

        function getResponse(routeDescription) {

            var value = routeDescription.response.sample,
                validators = getValidators(routeDescription.response);

            return {
                value: value,
                name: 'sample-response',
                displayName: 'Sample response',
                type: routeDescription.response.type,
                visualizationType: validators.length > 0 ? getVisualizationType(value) : 'text',
                validators: validators
            };
        }

        function getValidators(container) {

            var i,
                validator,
                validators = [];

            for (i = 0; i < container.validators.length; i++) {

                validator = angular.copy(container.validators[i]);

                if (validator.pattern) {

                    validator.pattern = new RegExp(validator.pattern);
                }

                validators.push(validator);
            }

            return validators;
        }

        function getVisualizationType(value) {

            return angular.isObject(value) ? 'json' : 'single-value';
        }
    }
})();
