(function() {

    'use strict';

    angular
        .module('apinterest.request')
        .factory('RequestRunner', RequestRunner);

    RequestRunner.$inject = ['$http', '$window', 'FileService', 'PathRenderService'];

    function RequestRunner($http, $window, fileService, pathRenderService) {

        return {
            run: run
        };

        function run (requestRunnerModel) {

            return requestRunnerModel.requiresAuthorization ?
                sendRequestWithToken(requestRunnerModel) :
                sendRequest(requestRunnerModel);
        }

        function sendRequestWithToken(requestRunnerModel) {

            return fetchToken(requestRunnerModel.username, requestRunnerModel.password)
                .then(function(response) {

                    requestRunnerModel.token = response.data.access_token;
                    return sendRequest(requestRunnerModel);
                })
                .catch(function(error) {

                    format(error, requestRunnerModel);
                });
        }

        function fetchToken(username, password) {

            return $http.post('./Token',
                'grant_type=password&username=' + username + '&password=' + password,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        }

        function sendRequest(requestRunnerModel) {

            var request = {
                    headers: {},
                    method: requestRunnerModel.httpMethod,
                    url: pathRenderService.renderUrlString(requestRunnerModel.pathModel),
                    responseType: requestRunnerModel.downloadResponseAsFile ? 'arraybuffer' : 'json'
                };

            addTokenToHeader(request, requestRunnerModel);
            addPostData(request, requestRunnerModel);

            return $http(request)
                .then(function(response) {

                    format(response, requestRunnerModel);
                    download(response, requestRunnerModel);
                })
                .catch(function(error) {

                    format(error, requestRunnerModel);
                });
        }

        function addTokenToHeader(request, requestRunnerModel) {

            /* istanbul ignore else */
            if (requestRunnerModel.requiresAuthorization) {

                request.headers.Authorization = 'Bearer ' + requestRunnerModel.token;
            }
        }

        function addPostData(request, requestRunnerModel) {

            if (request.method === 'POST') {

                if (requestRunnerModel.files) {

                    fileService.initializeUploadRequest(request, requestRunnerModel.files);
                }
                else {

                    addPostBody(request, requestRunnerModel);
                }
            }
        }

        function addPostBody(request, requestRunnerModel) {

            var i;

            for (i = 0; i < requestRunnerModel.parameters.length; i++) {

                /* istanbul ignore else */
                if (requestRunnerModel.parameters[i].source === 'FromBody') {

                    request.data = requestRunnerModel.parameters[i].value;
                }
            }
        }

        function format(response, requestRunnerModel) {

            var ok = response.status >= 200 && response.status <= 207,
                contentType = response.headers('Content-Type'),
                isEditableContent = ok && contentType && contentType.indexOf('application/json') > -1,
                visualizationType;

            if (isEditableContent) {

                visualizationType = angular.isObject(response.data) ? 'json' : 'single-value';
            }
            else {

                visualizationType = 'text';
            }

            requestRunnerModel.response.name = 'live-response-content';
            requestRunnerModel.response.contentType = contentType;
            requestRunnerModel.response.displayName = contentType;
            requestRunnerModel.response.visualizationType = visualizationType;
            requestRunnerModel.response.status = response.status;
            requestRunnerModel.response.statusText = response.statusText;
            requestRunnerModel.response.value = response.data;
            requestRunnerModel.response.ok = ok;
        }

        function download(response, requestRunnerModel) {

            if (requestRunnerModel.response.ok && requestRunnerModel.downloadResponseAsFile) {

                fileService.saveResponseAsFile(response.data, requestRunnerModel.response.contentType);
            }
        }
    }
})();
