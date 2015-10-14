(function() {

    'use strict';

    angular
        .module('apinterest.explorer')
        .factory('ExplorerService', ExplorerService);

    ExplorerService.$inject = ['$http', 'RecentHistory', 'RequestRunner', 'RequestService'];

    function ExplorerService($http, recentHistory, requestRunner, requestService) {

        return {
            setupViewModel: setupViewModel,
            filterRouteDescriptions: filterRouteDescriptions,
            initializeDetailsView: initializeDetailsView,
            initializeRequestRunnerView: initializeRequestRunnerView,
            useRecentHistoryItem: useRecentHistoryItem,
            runRequest: runRequest
        };

        function setupViewModel(vm) {

            vm.filterText = '';

            $http.get('apinterest/route-descriptions')
                .then(function(response) {
                    vm.routeDescriptions = response.data;
                    vm.filteredRouteDescriptions = response.data;
                });
        }

        function filterRouteDescriptions(vm) {

            vm.filteredRouteDescriptions = [];

            var i,
                lowerCasePath,
                lowerCaseHttpMethod,
                lowerCaseFilter;

            for (i = 0; i < vm.routeDescriptions.length; i++) {

                lowerCasePath = vm.routeDescriptions[i].relativePath.toLowerCase();
                lowerCaseHttpMethod = vm.routeDescriptions[i].httpMethod.toLowerCase();
                lowerCaseFilter = vm.filterText.toLowerCase();

                /* istanbul ignore else */
                if (vm.filterText === '' ||
                    lowerCasePath.indexOf(lowerCaseFilter) >= 0 ||
                    lowerCaseHttpMethod.indexOf(lowerCaseFilter) >= 0) {

                    vm.filteredRouteDescriptions.push(vm.routeDescriptions[i]);
                }
            }
        }

        function initializeDetailsView(vm, id) {

            vm.detailsModel = getRouteDescriptionById(vm, id);
            vm.runnerViewVisible = false;
            vm.detailsViewVisible = true;
        }

        function initializeRequestRunnerView(vm, id) {

            var routeDescription = getRouteDescriptionById(vm, id);

            vm.detailsViewVisible = false;
            vm.runnerViewVisible = true;
            vm.response = null;
            vm.requestRunnerModel = requestService.createRequestRunnerModel(routeDescription);
        }

        function useRecentHistoryItem(vm) {

            vm.requestRunnerModel.username = vm.requestRunnerModel.recentHistoryItem.username;
            vm.requestRunnerModel.password = vm.requestRunnerModel.recentHistoryItem.password;

            requestService.updateParameters(vm.requestRunnerModel, vm.requestRunnerModel.recentHistoryItem.parameters);
        }

        function runRequest(vm) {

            vm.requestInProgress = true;

            requestRunner.run(vm.requestRunnerModel)
                .then(function() {

                    recentHistory.save(vm.requestRunnerModel);
                    vm.requestRunnerModel.recentHistoryList = recentHistory.get(vm.requestRunnerModel.id);

                    vm.requestInProgress = false;
                });
        }

        function getRouteDescriptionById(vm, id) {

            var i;

            for (i = 0; i < vm.filteredRouteDescriptions.length; i++) {

                /* istanbul ignore else */
                if (vm.filteredRouteDescriptions[i].id === id) {

                    return vm.filteredRouteDescriptions[i];
                }
            }

            return undefined;
        }
    }
})();
