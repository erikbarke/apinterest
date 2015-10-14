describe('explorer-service', function() {

    'use strict';

    var explorerService,
        mockRequestService,
        mockRouteDescriptions,
        mockRequestRunnerModel,
        $httpBackend;

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

        mockRequestService = {
            createRequestRunnerModel: function() {
                return mockRequestRunnerModel;
            }
        };

        module(function($provide) {

            $provide.value('RequestService', mockRequestService);
        });

        inject(function($injector) {

            explorerService = $injector.get('ExplorerService');
            $httpBackend = $injector.get('$httpBackend');
        });

        $httpBackend
            .when('GET', 'apinterest/route-descriptions')
            .respond(200, mockRouteDescriptions);

        spyOn(mockRequestService, 'createRequestRunnerModel').and.callThrough();
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
});
