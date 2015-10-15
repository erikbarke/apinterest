describe('explorer-service', function() {

    'use strict';

    var explorerService,
        mockRecentHistory,
        mockRequestRunner,
        mockRequestService,
        mockRouteDescriptions,
        mockRequestRunnerModel,
        runRequestPromise,
        $httpBackend,
        $q,
        $rootScope;

    beforeEach(function() {

        module('apinterest.explorer');

        mockRouteDescriptions = [
            {
                id: 'GETsome/path',
                relativePath: 'some/path',
                httpMethod: 'GET'
            }
        ];

        mockRequestRunnerModel = {};

        mockRecentHistory = {
            save: function() {},
            get: function(value) {
                return [value];
            }
        };

        mockRequestRunner = {
            run: function() {}
        };

        mockRequestService = {
            createRequestRunnerModel: function() {
                return mockRequestRunnerModel;
            },
            updateParameters: function() {}
        };

        module(function($provide) {

            $provide.value('RecentHistory', mockRecentHistory);
            $provide.value('RequestRunner', mockRequestRunner);
            $provide.value('RequestService', mockRequestService);
        });

        inject(function($injector) {

            explorerService = $injector.get('ExplorerService');
            $httpBackend = $injector.get('$httpBackend');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        $httpBackend
            .when('GET', 'apinterest/route-descriptions')
            .respond(200, mockRouteDescriptions);

        spyOn(mockRecentHistory, 'save');
        spyOn(mockRecentHistory, 'get').and.callThrough();

        spyOn(mockRequestService, 'createRequestRunnerModel').and.callThrough();
        spyOn(mockRequestService, 'updateParameters');

        spyOn(mockRequestRunner, 'run').and.callFake(function() {
            runRequestPromise = $q.defer();
            return runRequestPromise.promise;
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should setup the view model, filterText', function() {

        var mockVm = {};
        explorerService.setupViewModel(mockVm);

        $httpBackend.flush();

        expect(mockVm.filterText).toEqual('');
    });

    it('should fetch route descriptions', function() {

        $httpBackend.expectGET('apinterest/route-descriptions');

        var mockVm = {};
        explorerService.setupViewModel(mockVm);

        $httpBackend.flush();

        expect(mockVm.routeDescriptions).toEqual(mockRouteDescriptions);
        expect(mockVm.filteredRouteDescriptions).toEqual(mockRouteDescriptions);
    });

    it('should filter route descriptions', function() {

        var mockVm = {
            routeDescriptions: mockRouteDescriptions,
            filterText: 'does not exist'
        };

        explorerService.filterRouteDescriptions(mockVm);

        expect(mockVm.filteredRouteDescriptions.length).toEqual(0);
    });

    it('should filter route descriptions, http method', function() {

        var mockVm = {
            routeDescriptions: mockRouteDescriptions,
            filterText: 'GET'
        };

        explorerService.filterRouteDescriptions(mockVm);

        expect(mockVm.filteredRouteDescriptions.length).toEqual(1);
        expect(mockVm.filteredRouteDescriptions[0].relativePath).toEqual('some/path');
    });

    it('should filter route descriptions, relative path', function() {

        var mockVm = {
            routeDescriptions: mockRouteDescriptions,
            filterText: 'some'
        };

        explorerService.filterRouteDescriptions(mockVm);

        expect(mockVm.filteredRouteDescriptions.length).toEqual(1);
        expect(mockVm.filteredRouteDescriptions[0].relativePath).toEqual('some/path');
    });

    it('should initialize the details view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeDetailsView(mockVm, 'GETsome/path');

        expect(mockVm.detailsModel.relativePath).toEqual('some/path');
    });

    it('should initialize the details view and show the view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeDetailsView(mockVm, 'GETsome/path');

        expect(mockVm.detailsViewVisible).toBeTruthy();
    });

    it('should initialize the details view and hide the request runner view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeDetailsView(mockVm, 'GETsome/path');

        expect(mockVm.runnerViewVisible).toBeFalsy();
    });

    it('should initialize the details view and handle path not found', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeDetailsView(mockVm, 'does not exist');

        expect(mockVm.detailsModel).toBeUndefined();
    });

    it('should initialize the request runner view and show the view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeRequestRunnerView(mockVm, 'GETsome/path');

        expect(mockVm.runnerViewVisible).toBeTruthy();
    });

    it('should initialize the request runner view and hide the details view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeRequestRunnerView(mockVm, 'GETsome/path');

        expect(mockVm.detailsViewVisible).toBeFalsy();
    });

    it('should initialize the request runner view and reset the response model', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeRequestRunnerView(mockVm, 'GETsome/path');

        expect(mockVm.response).toBeNull();
    });

    it('should initialize the request runner view and call the RequestService', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeRequestRunnerView(mockVm, 'GETsome/path');

        expect(mockRequestService.createRequestRunnerModel).toHaveBeenCalledWith(mockRouteDescriptions[0]);
    });

    it('should initialize the request runner view and set the request runner model', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.initializeRequestRunnerView(mockVm, 'GETsome/path');

        expect(mockVm.requestRunnerModel).toEqual(mockRequestRunnerModel);
    });

    it('should use recent history item and set username', function() {

        var mockVm = {
            requestRunnerModel: {
                recentHistoryItem: {
                    username: 'abc123'
                }
            }
        };

        explorerService.useRecentHistoryItem(mockVm);

        expect(mockVm.requestRunnerModel.username).toEqual('abc123');
    });

    it('should use recent history item and set password', function() {

        var mockVm = {
            requestRunnerModel: {
                recentHistoryItem: {
                    password: 'abc123'
                }
            }
        };

        explorerService.useRecentHistoryItem(mockVm);

        expect(mockVm.requestRunnerModel.password).toEqual('abc123');
    });

    it('should use recent history item and update parameters', function() {

        var mockVm = {
            requestRunnerModel: {
                recentHistoryItem: {
                    parameters: [{ name: 'id', value: 42 }]
                }
            }
        };

        explorerService.useRecentHistoryItem(mockVm);

        expect(mockRequestService.updateParameters)
            .toHaveBeenCalledWith(mockVm.requestRunnerModel, mockVm.requestRunnerModel.recentHistoryItem.parameters);
    });

    it('should use recent history item and handle undefined item', function() {

        var mockVm = {
            requestRunnerModel: {
                recentHistoryItem: undefined
            }
        };

        explorerService.useRecentHistoryItem(mockVm);

        expect(mockVm.requestRunnerModel.username).toBeUndefined();
    });

    it('should run request and set request in progress flag', function() {

        var mockVm = {
            requestRunnerModel: {
                id: 42
            }
        };

        explorerService.runRequest(mockVm);

        expect(mockVm.requestInProgress).toBeTruthy();
    });

    it('should run request and reset request in progress flag when done', function() {

        var mockVm = {
            requestRunnerModel: {
                id: 42
            }
        };

        explorerService.runRequest(mockVm);

        runRequestPromise.resolve();
        $rootScope.$digest();

        expect(mockVm.requestInProgress).toBeFalsy();
    });

    it('should run request and save recent history through RecentHistory service', function() {

        var mockVm = {
            requestRunnerModel: {
                id: 42
            }
        };

        explorerService.runRequest(mockVm);

        runRequestPromise.resolve();
        $rootScope.$digest();

        expect(mockRecentHistory.save).toHaveBeenCalledWith(mockVm.requestRunnerModel);
    });

    it('should run request and set recent history list', function() {

        var mockVm = {
            requestRunnerModel: {
                id: 42
            }
        };

        explorerService.runRequest(mockVm);

        runRequestPromise.resolve();
        $rootScope.$digest();

        expect(mockVm.requestRunnerModel.recentHistoryList).toEqual([42]);
    });

    it('should run request and get recent history list from RecentHistory service', function() {

        var mockVm = {
            requestRunnerModel: {
                id: 42
            }
        };

        explorerService.runRequest(mockVm);

        runRequestPromise.resolve();
        $rootScope.$digest();

        expect(mockRecentHistory.get).toHaveBeenCalledWith(mockVm.requestRunnerModel.id);
    });
});
