describe('Explorer', function() {

    'use strict';

    var explorerController,
        mockExplorerService;

    beforeEach(function() {

        module('apinterest.explorer');

        mockExplorerService = {
            setupViewModel: function() {},
            filterRouteDescriptions: function() {},
            initializeDetailsView: function() {},
            initializeRequestRunnerView: function() {},
            useRecentHistoryItem: function() {},
            runRequest: function() {}
        };

        spyOn(mockExplorerService, 'setupViewModel');
        spyOn(mockExplorerService, 'filterRouteDescriptions');
        spyOn(mockExplorerService, 'initializeDetailsView');
        spyOn(mockExplorerService, 'initializeRequestRunnerView');
        spyOn(mockExplorerService, 'useRecentHistoryItem');
        spyOn(mockExplorerService, 'runRequest');

        inject(function($controller) {

            explorerController = $controller('Explorer', {
                ExplorerService: mockExplorerService
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

        expect(mockExplorerService.initializeDetailsView).toHaveBeenCalledWith(explorerController, 'GETsome/path');
    });

    it('should show request runner view', function() {

        explorerController.showRequestRunnerView('GETsome/path');

        expect(mockExplorerService.initializeRequestRunnerView).toHaveBeenCalledWith(explorerController, 'GETsome/path');
    });

    it('should use recent history item', function() {

        explorerController.useRecentHistoryItem();

        expect(mockExplorerService.useRecentHistoryItem).toHaveBeenCalledWith(explorerController);
    });

    it('should run request', function() {

        explorerController.runRequest();

        expect(mockExplorerService.runRequest).toHaveBeenCalledWith(explorerController);
    });
});
