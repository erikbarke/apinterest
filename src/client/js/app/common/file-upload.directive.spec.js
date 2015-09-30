describe('file-upload', function() {

    'use strict';

    var $compile,
        $rootScope,
        element,
        mockFiles;

    beforeEach(function() {

        module('apinterest.common');

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

        element.triggerHandler({
            type: 'change',
            target: {
                files: mockFiles
            }
        });

        $rootScope.$digest();
    });

    it('should set model files on change', function() {

        expect($rootScope.model.files).toEqual(mockFiles);
    });
});
