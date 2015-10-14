describe('request-runner', function() {

    'use strict';

    var requestRunner,
        $httpBackend,
        mockPathRenderService,
        mockRequestRunnerModel,
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

        mockPathRenderService = {
            renderUrlString: function(value) {
                return value;
            }
        };

        module(function($provide) {

            $provide.value('PathRenderService', mockPathRenderService);
        });

        inject(function($injector) {

            requestRunner = $injector.get('RequestRunner');
            $httpBackend = $injector.get('$httpBackend');
        });

        mockRequestRunnerModel = {
            requiresAuthorization: true,
            httpMethod: 'GET',
            path: 'default/happy/test/path',
            pathModel: 'default/happy/test/path',
            username: 'username',
            password: 'password',
            response: {}
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

        $httpBackend.when('GET', mockRequestRunnerModel.pathModel)
            .respond(200, mockGetResponseJsonValue, mockContentTypeJson, mockHttpStatusOk);

        spyOn(mockPathRenderService, 'renderUrlString').and.callThrough();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch token when authorization required', function() {

        $httpBackend.expectPOST('./Token', 'grant_type=password&username=username&password=password');

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.token).toEqual(mockTokenResponse.access_token);
    });

    it('should not fetch token when authorization not required', function() {

        mockRequestRunnerModel.requiresAuthorization = false;

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.token).toBeUndefined();
    });

    it('should call path service to transform path model to url string', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockPathRenderService.renderUrlString).toHaveBeenCalledWith(mockRequestRunnerModel.pathModel);
    });

    it('should format response 200, name', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.name).toEqual('live-response-content');
    });

    it('should format response 200, content type', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.contentType).toEqual('application/json');
    });

    it('should format response 200, display name', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.displayName).toEqual('application/json');
    });

    it('should format response 200, visualization type', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.visualizationType).toEqual('json');
    });

    it('should format response 200, status', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.status).toEqual(200);
    });

    it('should format response 200, status text', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.statusText).toEqual(mockHttpStatusOk);
    });

    it('should format response 200, value', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.value).toEqual(mockGetResponseJsonValue);
    });

    it('should format response 200, ok', function() {

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.ok).toBeTruthy();
    });

    it('should format response 200, visualization type single-value', function() {

        mockRequestRunnerModel.pathModel = 'path/that/returns/single/value';

        $httpBackend.when('GET', mockRequestRunnerModel.pathModel)
            .respond(200, mockGetResponseSingleValue, mockContentTypeJson, mockHttpStatusOk);

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.visualizationType).toEqual('single-value');
    });

    it('should format response 200, visualization type text', function() {

        mockRequestRunnerModel.pathModel = 'path/that/returns/text/plain';

        $httpBackend.when('GET', mockRequestRunnerModel.pathModel)
            .respond(200, mockGetResponseSingleValue, mockContentTypeText, mockHttpStatusOk);

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.visualizationType).toEqual('text');
    });

    it('should add body parameter', function() {

        var expectedHeaders = {
            Authorization: 'Bearer xyz',
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'
        };

        mockRequestRunnerModel.pathModel = 'post/path';
        mockRequestRunnerModel.httpMethod = 'POST';
        mockRequestRunnerModel.parameters = [
            {
                source: 'FromUri',
                value: 'uri value'
            },
            {
                source: 'FromBody',
                value: 'post body value'
            }
        ];

        $httpBackend.when('POST', mockRequestRunnerModel.pathModel)
            .respond(200, mockGetResponseJsonValue);

        $httpBackend.expectPOST(mockRequestRunnerModel.pathModel, mockRequestRunnerModel.parameters[1].value, expectedHeaders);

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();
    });

    it('should add upload files', function() {

        var expectedHeaders = {
            Authorization: 'Bearer xyz',
            Accept: 'application/json, text/plain, */*',
        };

        mockRequestRunnerModel.pathModel = 'post/path';
        mockRequestRunnerModel.httpMethod = 'POST';
        mockRequestRunnerModel.files = [
            {
                name: 'file1'
            },
            {
                name: 'file2'
            }
        ];

        $httpBackend.when('POST', mockRequestRunnerModel.pathModel, function(formData) {
            expect(formData).toEqual(new FormData());
            return true;
        }, expectedHeaders).respond(200, mockGetResponseJsonValue);

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();
    });

    it('should handle response error after fetch token', function() {

        mockRequestRunnerModel.username = 'invalidusername';
        mockRequestRunnerModel.password = 'invalidpassword';

        $httpBackend.when('POST', './Token', 'grant_type=password&username=invalidusername&password=invalidpassword')
            .respond(400, mockTokenErrorResponse);

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.value).toEqual(mockTokenErrorResponse);
    });

    it('should handle response error after fetch data', function() {

        mockRequestRunnerModel.pathModel = 'path/that/returns/server/error';

        $httpBackend.when('GET', mockRequestRunnerModel.pathModel)
            .respond(500, mockGetResponseErrorValue);

        requestRunner.run(mockRequestRunnerModel);

        $httpBackend.flush();

        expect(mockRequestRunnerModel.response.value).toEqual(mockGetResponseErrorValue);
    });
});
