describe('ExplorerController', function() {

    'use strict';

    var explorerController,
        mockExplorerService,
        mockRequestRunner;

    beforeEach(function() {

        module('apinterest');

        mockExplorerService = {
            setupViewModel: function() {},
            filterRouteDescriptions: function() {},
            setDetailsModel: function() {},
            setRequestRunnerModel: function() {}
        };

        mockRequestRunner = {
            run: function() {}
        };

        spyOn(mockExplorerService, 'setupViewModel');
        spyOn(mockExplorerService, 'filterRouteDescriptions');
        spyOn(mockExplorerService, 'setDetailsModel');
        spyOn(mockExplorerService, 'setRequestRunnerModel');
        spyOn(mockRequestRunner, 'run');

        inject(function($controller) {

            explorerController = $controller('Explorer', {
                ExplorerService: mockExplorerService,
                RequestRunner: mockRequestRunner
            });
        });
    });

    it('should setup view model', function() {

        expect(mockExplorerService.setupViewModel).toHaveBeenCalledWith(explorerController);
    });

    it('should filter route descriptions', function() {

        explorerController.filterRouteDescriptions();

        expect(mockExplorerService.filterRouteDescriptions).toHaveBeenCalledWith(explorerController);
    });

    it('should show details view', function() {

        explorerController.showDetailsView('GETsome/path');

        expect(mockExplorerService.setDetailsModel).toHaveBeenCalledWith(explorerController, 'GETsome/path');
    });

    it('should show request runner view', function() {

        explorerController.showRequestRunnerView('GETsome/path');

        expect(mockExplorerService.setRequestRunnerModel).toHaveBeenCalledWith(explorerController, 'GETsome/path');
    });

    it('should run request', function() {

        explorerController.runRequest();

        expect(mockRequestRunner.run).toHaveBeenCalledWith(explorerController);
    });
});
