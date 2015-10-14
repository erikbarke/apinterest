(function() {

    'use strict';

    angular
        .module('apinterest.explorer')
        .controller('Explorer', Explorer);

    Explorer.$inject = ['ExplorerService'];

    function Explorer(explorerService) {

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

            explorerService.runRequest(vm);
        }
    }
})();
