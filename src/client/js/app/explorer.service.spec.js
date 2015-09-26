describe('explorer-service', function() {

    'use strict';

    var explorerService,
        mockRequestService,
        mockRouteDescriptions,
        $httpBackend;

    beforeEach(function() {

        module('apinterest');

        mockRequestService = {};

        module(function($provide) {

            $provide.value('RequestService', mockRequestService);
        });

        inject(function($injector) {

            explorerService = $injector.get('ExplorerService');
            $httpBackend = $injector.get('$httpBackend');
        });

        mockRouteDescriptions = [];

        $httpBackend
            .when('GET', 'apinterest/route-descriptions')
            .respond(200, mockRouteDescriptions);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should setup view model, filterText', function() {

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

        expect(mockVm.filterText).toEqual('');
    });
});
