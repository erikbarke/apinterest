(function() {

    'use strict';

    angular
        .module('apinterest.request')
        .factory('RequestService', RequestService);

    RequestService.$inject = ['PathModelService', 'RecentHistory'];

    function RequestService(pathModelService, recentHistory) {

        return {
            createRequestRunnerModel: createRequestRunnerModel,
            updateParameters: updateParameters
        };

        function createRequestRunnerModel(routeDescription) {

            var parameters = createParameters(routeDescription);

            return {
                id: routeDescription.id,
                path: routeDescription.relativePath,
                pathModel: pathModelService.getModel(routeDescription.relativePath, parameters),
                httpMethod: routeDescription.httpMethod,
                requiresAuthorization: routeDescription.requiresAuthorization,
                parameters: parameters,
                response: getResponse(routeDescription),
                recentHistoryList: recentHistory.get(routeDescription.id)
            };
        }

        function updateParameters(requestRunnerModel, parameters) {

            var i,
                targetParameter,
                sourceParameter;

            for (i = 0; i < requestRunnerModel.parameters.length; i++) {

                targetParameter = requestRunnerModel.parameters[i];
                sourceParameter = getParameterByName(parameters, targetParameter.name);

                if (sourceParameter) {
                    targetParameter.value = sourceParameter.value;
                }
            }

            requestRunnerModel.pathModel = pathModelService.getModel(requestRunnerModel.path, requestRunnerModel.parameters);
        }

        function getParameterByName(parameters, name) {

            var i;

            for (i = 0; i < parameters.length; i++) {

                if (parameters[i].name === name) {

                    return parameters[i];
                }
            }

            return null;
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
