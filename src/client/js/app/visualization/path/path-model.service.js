(function() {

    'use strict';

    angular
        .module('apinterest.visualization.path')
        .factory('PathModelService', PathModelService);

    function PathModelService() {

        return {
            getModel: getModel
        };

        function getModel(path, parameters) {

            var absolutePath = path.split('?')[0],
                absolutePathChunks = getAbsolutePathChunks(absolutePath, parameters),
                queryStringChunks = getQueryStringChunks(absolutePathChunks, parameters),
                useFullyQualifiedNotation = hasMoreThanNonSimpleObject(queryStringChunks);

            return {
                absolutePathChunks: absolutePathChunks,
                queryStringChunks: queryStringChunks,
                useFullyQualifiedNotation: useFullyQualifiedNotation
            };
        }

        function getAbsolutePathChunks(absolutePath, parameters) {

            var i,
                splitPath = absolutePath.split(/({.*?})/),
                chunks = [],
                chunk;

            for (i = 0; i < splitPath.length; i++) {

                if (splitPath[i] === '') {
                    continue;
                }

                chunk = {
                    text: splitPath[i],
                    parameter: getParameter(parameters, splitPath[i])
                };

                chunks.push(chunk);
            }

            return chunks;
        }

        function getQueryStringChunks(absolutePathChunks, parameters) {

            var i,
                queryStringParameters = getQueryStringParameters(absolutePathChunks, parameters),
                queryStringChunks = [];

            for (i = 0; i < queryStringParameters.length; i++) {

                queryStringChunks.push({

                    text: queryStringParameters[i].name,
                    parameter: queryStringParameters[i]
                });
            }

            return queryStringChunks;
        }

        function getQueryStringParameters(absolutePathChunks, parameters) {

            var i,
                queryStringParameters = [];

            for (i = 0; i < parameters.length; i++) {

                if (parameters[i].source === 'FromUri' && !hasParameter(absolutePathChunks, parameters[i])) {

                    queryStringParameters.push(parameters[i]);
                }
            }

            return queryStringParameters;
        }

        function hasParameter(absolutePathChunks, parameter) {

            var i;

            for (i = 0; i < absolutePathChunks.length; i++) {

                if (absolutePathChunks[i].parameter && absolutePathChunks[i].parameter.name === parameter.name) {

                    return true;
                }
            }

            return false;
        }

        function getParameter(parameters, name) {

            var i;

            for (i = 0; i < parameters.length; i++) {

                if ('{' + parameters[i].name + '}' === name) {

                    return parameters[i];
                }
            }

            return null;
        }

        function hasMoreThanNonSimpleObject(queryStringChunks) {

            var i,
                nonSimpleObjectCount = 0;

            for (i = 0; i < queryStringChunks.length; i++) {

                /* istanbul ignore else */
                if (queryStringChunks[i].category !== 'simple') {

                    nonSimpleObjectCount++;
                }

                if (nonSimpleObjectCount > 1) {

                    return true;
                }
            }

            return false;
        }
    }
})();
