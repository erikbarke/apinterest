(function() {

    'use strict';

    angular
        .module('apinterest.visualization.path')
        .factory('PathRenderService', PathRenderService);

    function PathRenderService() {

        return {
            renderUrlString: renderUrlString
        };

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
