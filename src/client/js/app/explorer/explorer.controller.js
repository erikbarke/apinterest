(function() {

    'use strict';

    angular
        .module('apinterest.explorer')
        .controller('Explorer', Explorer);

    Explorer.$inject = ['ExplorerService', 'RequestRunner', 'RecentHistory'];

    function Explorer(explorerService, requestRunner, recentHistory) {

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

            explorerService.initializeDetailsView(vm, id);
        }

        function showRequestRunnerView(id) {

            explorerService.initializeRequestRunnerView(vm, id);
        }

        function useRecentHistoryItem() {

            explorerService.useRecentHistoryItem(vm);
        }

        function runRequest() {

            requestRunner.run(vm);
            recentHistory.save(vm.requestRunnerModel);
        }
    }
})();
