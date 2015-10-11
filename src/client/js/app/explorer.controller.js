(function() {

    'use strict';

    angular
        .module('apinterest')
        .controller('Explorer', Explorer);

    Explorer.$inject = ['ExplorerService', 'RequestRunner', 'StorageService'];

    function Explorer(explorerService, requestRunner, storageService) {

        var vm = this;

        vm.filterRouteDescriptions = filterRouteDescriptions;
        vm.showDetailsView = showDetailsView;
        vm.showRequestRunnerView = showRequestRunnerView;
        vm.useRecentHistoryItem = useRecentHistoryItem;
        vm.runRequest = runRequest;

        explorerService.setupViewModel(vm);

        function filterRouteDescriptions() {

            explorerService.filterRouteDescriptions(vm);
        }

        function showDetailsView(id) {

            explorerService.setDetailsModel(vm, id);
        }

        function showRequestRunnerView(id) {

            explorerService.createRequestRunnerModel(vm, id);
        }

        function useRecentHistoryItem() {

            explorerService.useRecentHistoryItem(vm);
        }

        function runRequest() {

            requestRunner.run(vm);
            storageService.save(vm.requestRunnerModel);
        }
    }
})();
