describe('explorer-service', function() {

    'use strict';

    var explorerService,
        mockRequestService,
        mockRouteDescriptions,
        mockRequestRunnerModel,
        $httpBackend,
        $timeout;

    beforeEach(function() {

        module('apinterest');

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
            $timeout = $injector.get('$timeout');
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

    it('should set the details model', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.setDetailsModel(mockVm, 'GETsome/path');

        expect(mockVm.detailsModel.relativePath).toEqual('some/path');
    });

    it('should set details model and show the details view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.setDetailsModel(mockVm, 'GETsome/path');

        expect(mockVm.detailsViewVisible).toBeTruthy();
    });

    it('should set details model and hide the request runner view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.setDetailsModel(mockVm, 'GETsome/path');

        expect(mockVm.runnerViewVisible).toBeFalsy();
    });

    it('should set details model and handle path not found', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.setDetailsModel(mockVm, 'does not exist');

        expect(mockVm.detailsModel).toBeUndefined();
    });

    it('should create request runner model and show the request runner view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.createRequestRunnerModel(mockVm, 'GETsome/path');

        expect(mockVm.runnerViewVisible).toBeTruthy();
    });

    it('should create request runner model and hide the details view', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.createRequestRunnerModel(mockVm, 'GETsome/path');

        expect(mockVm.detailsViewVisible).toBeFalsy();
    });

    it('should create request runner model and reset the request runner model', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.createRequestRunnerModel(mockVm, 'GETsome/path');

        expect(mockVm.requestRunnerModel).toBeNull();
    });

    it('should create request runner model and reset the response model', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.createRequestRunnerModel(mockVm, 'GETsome/path');

        expect(mockVm.response).toBeNull();
    });

    it('should create request runner model and call the RequestService', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.createRequestRunnerModel(mockVm, 'GETsome/path');

        $timeout.flush();

        expect(mockRequestService.createRequestRunnerModel).toHaveBeenCalledWith(mockRouteDescriptions[0]);
    });

    it('should create request runner model and set the request runner model', function() {

        var mockVm = {
            filteredRouteDescriptions: mockRouteDescriptions
        };

        explorerService.createRequestRunnerModel(mockVm, 'GETsome/path');

        $timeout.flush();

        expect(mockVm.requestRunnerModel).toEqual(mockRequestRunnerModel);
    });
});
