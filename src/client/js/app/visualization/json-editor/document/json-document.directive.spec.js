describe('JsonDocument', function() {

    'use strict';

    var mockJsonDocumentService,
        $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('apinterest.visualization.json-editor');

        mockJsonDocumentService = {
            createHtml: function() {
                return '<div>json document</div>';
            }
        };

        module(function($provide) {

            $provide.value('JsonDocumentService', mockJsonDocumentService);
        });

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $rootScope.name = 'name';
        $rootScope.model = {
            value: 'abc123'
        };
        $rootScope.validators = [];
    });

    it('should handle undefined model', function() {

        $rootScope.model.value = undefined;

        compile();

        expect(element.find('div').html()).toBeUndefined();
    });

    it('should handle null model', function() {

        $rootScope.model.value = undefined;

        compile();

        expect(element.find('div').html()).toBeUndefined();
    });

    it('should call json document service to create html', function() {

        spyOn(mockJsonDocumentService, 'createHtml').and.callThrough();

        compile();

        expect(mockJsonDocumentService.createHtml).toHaveBeenCalledWith('abc123', 'name', []);
    });

    it('should compile element with html from json document service', function() {

        compile();

        expect(element.find('div').html()).toEqual('json document');
    });

    function compile() {

        element = $compile('<div json-document name="name" model="model" validators="validators"></div>')($rootScope);

        $rootScope.$digest();
    }
});
