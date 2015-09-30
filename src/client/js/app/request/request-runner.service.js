(function() {

    'use strict';

    angular
        .module('apinterest.request')
        .factory('RequestRunner', RequestRunner);

    RequestRunner.$inject = ['$http', 'PathService', 'StorageService'];

    function RequestRunner($http, pathService, storageService) {

        return {
            run: function(vm) {

                vm.requestInProgress = true;
                vm.token = undefined;
                vm.response = null;

                if (vm.requestRunnerModel.requiresAuthorization) {

                    return sendRequestWithToken(vm);
                }
                else {

                    return sendRequest(vm);
                }
            }
        };

        function sendRequestWithToken(vm) {

            storageService.setUserCredentials(vm.requestRunnerModel.username, vm.requestRunnerModel.password, vm.requestRunnerModel.path);

            return fetchToken(vm.requestRunnerModel.username, vm.requestRunnerModel.password)
                .then(function(response) {

                    vm.token = response.data.access_token;
                    return sendRequest(vm);
                })
                .catch(function(error) {

                    vm.response = format(error);
                    vm.requestInProgress = false;
                });
        }

        function fetchToken(username, password) {

            return $http.post('./Token',
                'grant_type=password&username=' + username + '&password=' + password,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        }

        function sendRequest(vm) {

            var request = {
                    headers: {},
                    method: vm.requestRunnerModel.httpMethod,
                    url: pathService.renderUrlString(vm.requestRunnerModel.pathModel)
                };

            addTokenToHeader(request, vm);
            addPostData(request, vm);

            return $http(request)
                .then(function(response) {

                    vm.response = format(response);
                    vm.requestInProgress = false;
                })
                .catch(function(error) {

                    vm.response = format(error);
                    vm.requestInProgress = false;
                });
        }

        function addTokenToHeader(request, vm) {

            /* istanbul ignore else */
            if (vm.requestRunnerModel.requiresAuthorization) {

                request.headers.Authorization = 'Bearer ' + vm.token;
            }
        }

        function addPostData(request, vm) {

            if (request.method === 'POST') {

                if (vm.requestRunnerModel.files) {

                    addUploadFiles(request, vm);
                }
                else {

                    addPostBody(request, vm);
                }
            }
        }

        function addUploadFiles(request, vm) {

            var formData,
                file,
                i;

            formData = new FormData();

            for (i = 0; i < vm.requestRunnerModel.files.length; i++) {

                file = vm.requestRunnerModel.files[i];

                formData.append('file' + i, file, file.name);
            }

            request.headers['Content-Type'] = undefined;
            request.transformRequest = angular.identity;
            request.data = formData;
        }

        function addPostBody(request, vm) {

            var i;

            for (i = 0; i < vm.requestRunnerModel.parameters.length; i++) {

                /* istanbul ignore else */
                if (vm.requestRunnerModel.parameters[i].source === 'FromBody') {

                    request.data = vm.requestRunnerModel.parameters[i].value;
                }
            }
        }

        function format(response) {

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

            return {

                value: response.data,
                visualizationType: visualizationType,
                status: response.status,
                contentType: contentType,
                statusText: response.statusText,
                ok: ok
            };
        }
    }
})();