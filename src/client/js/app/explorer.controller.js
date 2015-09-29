(function() {

    'use strict';

    angular
        .module('apinterest')
        .controller('Explorer', Explorer);

    Explorer.$inject = ['ExplorerService', 'RequestRunner'];

    function Explorer(explorerService, requestRunner) {

        var vm = this;

        vm.filterRouteDescriptions = filterRouteDescriptions;
        vm.showDetailsView = showDetailsView;
        vm.showRequestRunnerView = showRequestRunnerView;
        vm.runRequest = runRequest;

        explorerService.setupViewModel(vm);

        function filterRouteDescriptions() {

            explorerService.filterRouteDescriptions(vm);
        }

        function showDetailsView(id) {

            explorerService.setDetailsModel(vm, id);
        }

        function showRequestRunnerView(id) {

            explorerService.setRequestRunnerModel(vm, id);
        }

        function runRequest() {

            requestRunner.run(vm);
        }
    }
})();
