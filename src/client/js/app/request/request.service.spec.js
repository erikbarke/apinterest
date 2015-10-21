describe('RequestService', function() {

    'use strict';

    var requestService,
        mockPathModel,
        mockPathModelService,
        mockRecentHistoryList,
        mockRecentHistory,
        mockRouteDescription;

    beforeEach(function() {

        module('apinterest.request');

        mockPathModel = {
            absolutePathChunks: [],
            queryStringChunks: [],
            useFullyQualifiedNotation: true
        };

        mockPathModelService = {
            getModel: function() {
                return mockPathModel;
            }
        };

        mockRecentHistoryList = {
            username: 'username',
            password: 'password'
        };

        mockRecentHistory = {
            get: function() {
                return mockRecentHistoryList;
            }
        };

        module(function($provide) {

            $provide.value('PathModelService', mockPathModelService);
            $provide.value('RecentHistory', mockRecentHistory);
        });

        inject(function($injector) {

            requestService = $injector.get('RequestService');
        });

        mockRouteDescription = {
            relativePath: 'some/path',
            httpMethod: 'GET',
            requiresAuthorization: true,
            parameters: [
                {
                    source: 'FromUri',
                    name: 'customer',
                    type: 'ProjectName.Customer',
                    category: 'object',
                    sample: { id: 1, name: 'Acme' },
                    validators: [
                        {
                            path: ''
                        },
                        {
                            path: '.id',
                            pattern: '.*'
                        }
                    ]
                },
                {
                    source: 'FromUri',
                    name: 'type',
                    type: 'System.String',
                    category: 'simple',
                    sample: '"organization"',
                    validators: [
                        {
                            path: ''
                        }
                    ]
                }
            ],
            response: {
                type: 'ProjectName.CustomerStatus',
                sample: { status: 'pending' },
                validators: [
                    {
                        path: ''
                    },
                    {
                        path: '.status',
                        pattern: '.*'
                    }
                ]
            }
        };
    });

    it('should create request runner model with path', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.path).toEqual('some/path');
    });

    it('should create request runner model with path model', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.pathModel.absolutePathChunks).toEqual(mockPathModel.absolutePathChunks);
    });

    it('should create request runner model with http method', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.httpMethod).toEqual('GET');
    });

    it('should create request runner model with "requires authorization"', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.requiresAuthorization).toBeTruthy();
    });

    it('should create request runner model with recent history list', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.recentHistoryList).toEqual(mockRecentHistoryList);
    });

    it('should create request runner model with parameters', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters.length).toEqual(2);
    });

    it('should create request runner model with parameters and deep copy sample values', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        model.parameters[0].value.name = 'edited value';

        expect(mockRouteDescription.parameters[0].sample.name).toEqual('Acme');
    });

    it('should create request runner model with parameters, source (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].source).toEqual('FromUri');
    });

    it('should create request runner model with parameters, name (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].name).toEqual('customer');
    });

    it('should create request runner model with parameters, display name (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].displayName).toEqual('FromUri {customer}');
    });

    it('should create request runner model with parameters, type (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].type).toEqual('ProjectName.Customer');
    });

    it('should create request runner model with parameters, category (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].category).toEqual('object');
    });

    it('should create request runner model with parameters, value (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].value.name).toEqual('Acme');
    });

    it('should create request runner model with parameters with validators (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].validators.length).toEqual(2);
    });

    it('should create request runner model with parameters with validators, path (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].validators[1].path).toEqual('.id');
    });

    it('should create request runner model with parameters with validators, pattern (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].validators[1].pattern).toEqual(new RegExp('.*'));
    });

    it('should create request runner model with parameters, visualization type (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[0].visualizationType).toEqual('json');
    });

    it('should create request runner model with parameters, visualization type (single-value)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.parameters[1].visualizationType).toEqual('single-value');
    });

    it('should create request runner model with response, value (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.value.status).toEqual('pending');
    });

    it('should create request runner model with response, name (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.name).toEqual('sample-response');
    });

    it('should create request runner model with response, display name (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.displayName).toEqual('Sample response');
    });

    it('should create request runner model with response, display name (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.displayName).toEqual('Sample response');
    });

    it('should create request runner model with response, type (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.type).toEqual('ProjectName.CustomerStatus');
    });

    it('should create request runner model with response, visualization type (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.visualizationType).toEqual('json');
    });

    it('should create request runner model with response with validators (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.validators.length).toEqual(2);
    });

    it('should create request runner model with response with validators, path (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.validators[1].path).toEqual('.status');
    });

    it('should create request runner model with response with validators, pattern (json)', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.validators[1].pattern).toEqual(new RegExp('.*'));
    });

    it('should create request runner model with response, visualization type (single-value)', function() {

        mockRouteDescription.response.sample = '"abc123"';

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.visualizationType).toEqual('single-value');
    });

    it('should create request runner model with response, visualization type (text)', function() {

        mockRouteDescription.response.validators = [];

        var model = requestService.createRequestRunnerModel(mockRouteDescription);

        expect(model.response.visualizationType).toEqual('text');
    });

    it('should update pararmeters', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription),
            mockHistoryParameters = [
                { name: 'customer', value: 'abc123' },
                { name: 'type', value: 42 }
            ];

        requestService.updateParameters(model, mockHistoryParameters);

        expect(model.parameters[0].value).toEqual('abc123');
        expect(model.parameters[1].value).toEqual(42);
    });

    it('should update pararmeters and handle parameters name mismatch', function() {

        var model = requestService.createRequestRunnerModel(mockRouteDescription),
            mockHistoryParameters = [
                { name: 'doesnotexist', value: 'abc123' }
            ];

        requestService.updateParameters(model, mockHistoryParameters);

        expect(model.parameters[0].value.name).toEqual('Acme');
    });
});
