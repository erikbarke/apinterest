(function() {

    'use strict';

    angular
        .module('apinterest.path')
        .factory('PathService', PathService);

    function PathService() {

        return {
            getModel: getModel,
            renderUrlString: renderUrlString
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

                if (queryStringChunks[i].category !== 'simple') {

                    nonSimpleObjectCount++;
                }

                if (nonSimpleObjectCount > 1) {

                    return true;
                }
            }

            return false;
        }

        function renderUrlString(pathModel) {

            var absolutePath = createAbsolutePath(pathModel.absolutePathChunks),
                questionMark = pathModel.queryStringChunks.length > 0 ? '?' : '',
                queryString = createQueryString(pathModel.queryStringChunks, pathModel.useFullyQualifiedNotation);

            return absolutePath + questionMark + queryString;
        }

        function createAbsolutePath(absolutePathChunks) {

            var pathString = '',
                i;

            for (i = 0; i < absolutePathChunks.length; i++) {

                pathString += absolutePathChunks[i].parameter ?
                    absolutePathChunks[i].parameter.value :
                    absolutePathChunks[i].text;
            }

            return pathString;
        }

        function createQueryString(queryStringChunks, useFullyQualifiedNotation) {

            var pathString = '',
                chunk,
                i;

            for (i = 0; i < queryStringChunks.length; i++) {

                chunk = queryStringChunks[i];

                if (i > 0) {

                    pathString += '&';
                }

                if (chunk.parameter.category === 'simple') {

                    pathString += chunk.text + '=' + chunk.parameter.value;
                }

                if (chunk.parameter.category === 'array') {

                    pathString += createArrayChunk(chunk);
                }

                if (chunk.parameter.category === 'hashtable') {

                    pathString += createHashtableChunk(chunk);
                }

                if (chunk.parameter.category === 'object' && useFullyQualifiedNotation) {

                    pathString += createQualifiedObjectChunk(chunk);
                }

                if (chunk.parameter.category === 'object' && !useFullyQualifiedNotation) {

                    pathString += createObjectChunk(chunk);
                }
            }

            return pathString;
        }

        function createArrayChunk(chunk) {

            var pathString = '',
                i;

            for (i = 0; i < chunk.parameter.value.length; i++) {

                if (i > 0) {

                    pathString += '&';
                }

                pathString += chunk.text + '[' + i + ']=' + chunk.parameter.value[i];
            }

            return pathString;
        }

        function createHashtableChunk(chunk) {

            var pathString = '',
                properties = Object.getOwnPropertyNames(chunk.parameter.value),
                i;

            for (i = 0; i < properties.length; i++) {

                if (i > 0) {

                    pathString += '&';
                }

                pathString += chunk.text + '[' + i + '].key=' + properties[i] + '&';
                pathString += chunk.text + '[' + i + '].value=' + chunk.parameter.value[properties[i]];
            }

            return pathString;
        }

        function createQualifiedObjectChunk(chunk) {

            var pathString = '',
                properties = Object.getOwnPropertyNames(chunk.parameter.value),
                i;

            for (i = 0; i < properties.length; i++) {

                if (i > 0) {

                    pathString += '&';
                }

                pathString += chunk.text + '.' + properties[i] + '=' + chunk.parameter.value[properties[i]];
            }

            return pathString;
        }

        function createObjectChunk(chunk) {

            var pathString = '',
                properties = Object.getOwnPropertyNames(chunk.parameter.value),
                propertyValue,
                i;

            for (i = 0; i < properties.length; i++) {

                if (i > 0) {

                    pathString += '&';
                }

                propertyValue = chunk.parameter.value[properties[i]];

                pathString += properties[i] + '=';

                if (propertyValue !== undefined && propertyValue !== null) {

                    pathString += propertyValue;
                }
            }

            return pathString;
        }
    }
})();
