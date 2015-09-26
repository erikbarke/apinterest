describe('request-runner', function() {

    'use strict';

    var requestRunner,
        $httpBackend,
        mockPathService,
        mockStorageService,
        mockVm,
        mockHttpStatusOk,
        mockContentTypeJson,
        mockContentTypeText,
        mockTokenResponse,
        mockTokenErrorResponse,
        mockGetResponseJsonValue,
        mockGetResponseErrorValue,
        mockGetResponseSingleValue;

    beforeEach(function() {

        module('apinterest.request');

        mockPathService = {
            renderUrlString: function(value) {
                return value;
            }
        };

        mockStorageService = {
            setUserCredentials: function() {
            }
        };

        module(function($provide) {

            $provide.value('PathService', mockPathService);
            $provide.value('StorageService', mockStorageService);
        });

        inject(function($injector) {

            requestRunner = $injector.get('RequestRunner');
            $httpBackend = $injector.get('$httpBackend');
        });

        mockVm = {
            requestRunnerModel: {
                requiresAuthorization: true,
                httpMethod: 'GET',
                path: 'default/happy/test/path',
                pathModel: 'default/happy/test/path',
                username: 'username',
                password: 'password'
            }
        };

        mockHttpStatusOk = 'HTTP/1.1 200 OK';

        mockContentTypeJson = { 'Content-Type': 'application/json' };
        mockContentTypeText = { 'Content-Type': 'text/plain' };

        mockTokenResponse = {
            access_token: 'xyz'
        };

        mockTokenErrorResponse = {
            'invalid_grant': 'The user name or password is incorrect.'
        };

        mockGetResponseJsonValue = {
            property: 'value'
        };

        mockGetResponseSingleValue = '"abc123"';

        mockGetResponseErrorValue = {
            message: 'Out of cheese error'
        };

        $httpBackend.when('POST', './Token', 'grant_type=password&username=username&password=password')
            .respond(200, mockTokenResponse);

        $httpBackend.when('GET', mockVm.requestRunnerModel.pathModel)
            .respond(200, mockGetResponseJsonValue, mockContentTypeJson, mockHttpStatusOk);

        spyOn(mockStorageService, 'setUserCredentials').and.callThrough();
        spyOn(mockPathService, 'renderUrlString').and.callThrough();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should run and reset response', function() {

        requestRunner.run(mockVm);

        expect(mockVm.response).toBeNull();

        $httpBackend.flush();
    });

    it('should start and flag request in progress', function() {

        requestRunner.run(mockVm);

        expect(mockVm.requestInProgress).toBeTruthy();

        $httpBackend.flush();
    });

    it('should stop and flag request in progress', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.requestInProgress).toBeFalsy();
    });

    it('should run and clear token', function() {

        requestRunner.run(mockVm);

        expect(mockVm.token).toBeUndefined();

        $httpBackend.flush();
    });

    it('should store credentials when authorization required', function() {

        requestRunner.run(mockVm);

        expect(mockStorageService.setUserCredentials).toHaveBeenCalledWith('username', 'password', mockVm.requestRunnerModel.pathModel);

        $httpBackend.flush();
    });

    it('should fetch token when authorization required', function() {

        $httpBackend.expectPOST('./Token', 'grant_type=password&username=username&password=password');

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.token).toEqual(mockTokenResponse.access_token);
    });

    it('should not fetch token when authorization not required', function() {

        mockVm.requestRunnerModel.requiresAuthorization = false;

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.token).toBeUndefined();
    });

    it('should call path service to transform path model to url string', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockPathService.renderUrlString).toHaveBeenCalledWith(mockVm.requestRunnerModel.pathModel);
    });

    it('should format response 200, value', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.value).toEqual(mockGetResponseJsonValue);
    });

    it('should format response 200, visualization type', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.visualizationType).toEqual('json');
    });

    it('should format response 200, status', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.status).toEqual(200);
    });

    it('should format response 200, content type', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.contentType).toEqual('application/json');
    });

    it('should format response 200, ok', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.ok).toBeTruthy();
    });

    it('should format response 200, status text', function() {

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.statusText).toEqual(mockHttpStatusOk);
    });

    it('should format response 200, visualization type single-value', function() {

        mockVm.requestRunnerModel.pathModel = 'path/that/returns/single/value';

        $httpBackend.when('GET', mockVm.requestRunnerModel.pathModel)
            .respond(200, mockGetResponseSingleValue, mockContentTypeJson, mockHttpStatusOk);

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.visualizationType).toEqual('single-value');
    });

    it('should format response 200, visualization type text', function() {

        mockVm.requestRunnerModel.pathModel = 'path/that/returns/text/plain';

        $httpBackend.when('GET', mockVm.requestRunnerModel.pathModel)
            .respond(200, mockGetResponseSingleValue, mockContentTypeText, mockHttpStatusOk);

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.visualizationType).toEqual('text');
    });

    it('should add body parameter', function() {

        var expectedHeaders = {
            Authorization: 'Bearer xyz',
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'
        };

        mockVm.requestRunnerModel.pathModel = 'post/path';
        mockVm.requestRunnerModel.httpMethod = 'POST';
        mockVm.requestRunnerModel.parameters = [
            {
                source: 'FromUri',
                value: 'uri value'
            },
            {
                source: 'FromBody',
                value: 'post body value'
            }
        ];

        $httpBackend.when('POST', mockVm.requestRunnerModel.pathModel)
            .respond(200, mockGetResponseJsonValue);

        $httpBackend.expectPOST(mockVm.requestRunnerModel.pathModel, mockVm.requestRunnerModel.parameters[1].value, expectedHeaders);

        requestRunner.run(mockVm);

        $httpBackend.flush();
    });

    it('should add upload files', function() {

        var expectedHeaders = {
            Authorization: 'Bearer xyz',
            Accept: 'application/json, text/plain, */*'
        };

        mockVm.requestRunnerModel.pathModel = 'post/path';
        mockVm.requestRunnerModel.httpMethod = 'POST';
        mockVm.requestRunnerModel.files = [
            {
                name: 'file1'
            },
            {
                name: 'file2'
            }
        ];

        $httpBackend.when('POST', mockVm.requestRunnerModel.pathModel, function(formData) {
            expect(formData).toEqual(new FormData());
            return true;
        }, expectedHeaders).respond(200, mockGetResponseJsonValue);

        requestRunner.run(mockVm);

        $httpBackend.flush();
    });

    it('should handle response error after fetch token, response value', function() {

        mockVm.requestRunnerModel.username = 'invalidusername';
        mockVm.requestRunnerModel.password = 'invalidpassword';

        $httpBackend.when('POST', './Token', 'grant_type=password&username=invalidusername&password=invalidpassword')
            .respond(400, mockTokenErrorResponse);

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.value).toEqual(mockTokenErrorResponse);
    });

    it('should handle response error after fetch token, request in progress flag', function() {

        mockVm.requestRunnerModel.username = 'invalidusername';
        mockVm.requestRunnerModel.password = 'invalidpassword';

        $httpBackend.when('POST', './Token', 'grant_type=password&username=invalidusername&password=invalidpassword')
            .respond(400, mockTokenErrorResponse);

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.requestInProgress).toBeFalsy();
    });

    it('should handle response error after fetch data, response value', function() {

        mockVm.requestRunnerModel.pathModel = 'path/that/returns/server/error';

        $httpBackend.when('GET', mockVm.requestRunnerModel.pathModel)
            .respond(500, mockGetResponseErrorValue);

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.response.value).toEqual(mockGetResponseErrorValue);
    });

    it('should handle response error after fetch data, request in progress flag', function() {

        mockVm.requestRunnerModel.pathModel = 'path/that/returns/server/error';

        $httpBackend.when('GET', mockVm.requestRunnerModel.pathModel)
            .respond(500, mockGetResponseErrorValue);

        requestRunner.run(mockVm);

        $httpBackend.flush();

        expect(mockVm.requestInProgress).toBeFalsy();
    });
});
