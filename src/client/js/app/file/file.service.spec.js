describe('FileService', function() {

    'use strict';

    var fileService,
        mockRequest,
        mockBlob,
        mockFiles,
        $window;

    beforeEach(function() {

        module('apinterest.file');

        inject(function($injector) {

            fileService = $injector.get('FileService');
            $window = $injector.get('$window');
        });

        // new Blob() doesn't work in PhantomJS < 2.0
        if (typeof($window.Blob) !== typeof(Function)) {

            $window.Blob = function() {};
        }

        $window.saveAs = function() {};

        mockRequest = {
            headers: {}
        };

        mockBlob = new Blob();

        mockFiles = [
            { data: mockBlob, name: 'file0' },
            { data: mockBlob, name: 'file1' }
        ];

        spyOn(FormData.prototype, 'append');
        spyOn($window, 'saveAs').and.callThrough();
    });

    it('should initialize upload request and add files', function() {

        fileService.initializeUploadRequest(mockRequest, mockFiles);

        expect(FormData.prototype.append).toHaveBeenCalledWith('file0', mockBlob, 'file0');
        expect(FormData.prototype.append).toHaveBeenCalledWith('file1', mockBlob, 'file1');
    });

    it('should initialize upload request and set request header "Content-Type" to undefined to force browser to set Content-Type "multipart/form-data"', function() {

        fileService.initializeUploadRequest(mockRequest, mockFiles);

        expect(mockRequest.headers['Content-Type']).toBeUndefined();
    });

    it('should initialize upload request and set request property transformRequest, to prevent request to be serialized as json', function() {

        fileService.initializeUploadRequest(mockRequest, mockFiles);

        expect(mockRequest.transformRequest).toEqual(angular.identity);
    });

    it('should initialize upload request and set form data', function() {

        fileService.initializeUploadRequest(mockRequest, mockFiles);

        expect(mockRequest.data).toEqual(new FormData());
    });

    it('should save response as file', function() {

        fileService.saveResponseAsFile([72, 69, 76, 76, 79], '"text/plain"');

        expect($window.saveAs).toHaveBeenCalledWith(new $window.Blob(), 'apinterest-response.txt');
    });

    it('should save response as file and handle undefined content type', function() {

        fileService.saveResponseAsFile([72, 69, 76, 76, 79], undefined);

        expect($window.saveAs).toHaveBeenCalledWith(new $window.Blob(), 'apinterest-response');
    });

    it('should save response as file and handle unknown content type', function() {

        fileService.saveResponseAsFile([72, 69, 76, 76, 79], 'exotic/type');

        expect($window.saveAs).toHaveBeenCalledWith(new $window.Blob(), 'apinterest-response');
    });
});
