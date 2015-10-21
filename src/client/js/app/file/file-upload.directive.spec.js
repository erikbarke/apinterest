describe('file-upload', function() {

    'use strict';

    var $compile,
        $rootScope,
        element,
        mockFiles;

    beforeEach(function() {

        module('apinterest.file');

        mockFiles = [
            { name: 'file1' },
            { name: 'file2' }
        ];

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $rootScope.model = {
            x: 'y'
        };

        element = $compile('<span file-upload model="model"></span>')($rootScope);

        $rootScope.$digest();
    });

    it('should set model files on change', function() {

        var expectedFiles = [
            { data: { name: 'file1' }, name: 'file1' },
            { data: { name: 'file2' }, name: 'file2' },
        ];

        element.triggerHandler({
            type: 'change',
            target: {
                files: mockFiles
            }
        });

        $rootScope.$digest();

        expect($rootScope.model.files).toEqual(expectedFiles);
    });
});
