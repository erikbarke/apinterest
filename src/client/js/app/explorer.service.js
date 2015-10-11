(function() {

    'use strict';

    angular
        .module('apinterest')
        .factory('ExplorerService', ExplorerService);

    ExplorerService.$inject = ['$http', '$timeout', 'RequestService'];

    function ExplorerService($http, $timeout, requestService) {

        return {
            setupViewModel: setupViewModel,
            filterRouteDescriptions: filterRouteDescriptions,
            setDetailsModel: setDetailsModel,
            createRequestRunnerModel: createRequestRunnerModel,
            useRecentHistoryItem: useRecentHistoryItem
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

        function setDetailsModel(vm, id) {

            vm.detailsModel = getRouteDescriptionById(vm, id);
            vm.runnerViewVisible = false;
            vm.detailsViewVisible = true;
        }

        function createRequestRunnerModel(vm, id) {

            var routeDescription = getRouteDescriptionById(vm, id),
                requestRunnerModel = requestService.createRequestRunnerModel(routeDescription);

            vm.detailsViewVisible = false;
            vm.runnerViewVisible = true;
            vm.requestRunnerModel = null;
            vm.response = null;

            $timeout(function() {

                vm.requestRunnerModel = requestRunnerModel;
            });
        }

        function useRecentHistoryItem(vm) {

            if (vm.requestRunnerModel && vm.requestRunnerModel.recentHistoryItem) {

                vm.requestRunnerModel.pathModel = vm.requestRunnerModel.recentHistoryItem.pathModel;
                vm.requestRunnerModel.parameters = vm.requestRunnerModel.recentHistoryItem.parameters;
                vm.requestRunnerModel.username = vm.requestRunnerModel.recentHistoryItem.username;
                vm.requestRunnerModel.password = vm.requestRunnerModel.recentHistoryItem.password;
            }
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
