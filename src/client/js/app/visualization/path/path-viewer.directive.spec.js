describe('pathViewer', function() {

    'use strict';

    var $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('apinterest/content/js/app/visualization/path/path-viewer.html');
        module('apinterest.path');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $rootScope.model = {
            absolutePathChunks: [
                {
                    text: 'path/'
                },
                {
                    parameter: {
                        value: 'uriparameter'
                    }
                }
            ]
        };

    });

    it('should render url without querystring', function() {

        $rootScope.model.queryStringChunks = [];

        compile();

        expect(trim(element)).toEqual('path/uriparameter');
    });

    it('should render url with querystring, simple type', function() {

        $rootScope.model.queryStringChunks = [
            {
                text: 'simple',
                parameter: {
                    category: 'simple',
                    value: 'simple'
                }
            }
        ];

        compile();

        expect(trim(element)).toEqual('path/uriparameter?simple=simple');
    });

    it('should render url with querystring, array type', function() {

        $rootScope.model.queryStringChunks = [
            {
                text: 'array',
                parameter: {
                    category: 'array',
                    value: [
                        0,
                        1,
                        2
                    ]
                }
            }
        ];

        compile();

        expect(trim(element)).toEqual('path/uriparameter?array[0]=0&array[1]=1&array[2]=2');
    });

    it('should render url with querystring, hashtable type', function() {

        $rootScope.model.queryStringChunks = [
            {
                text: 'hashtable',
                parameter: {
                    category: 'hashtable',
                    value: {
                        a: 'b',
                        x: 'y'
                    }
                }
            }
        ];

        compile();

        expect(trim(element)).toEqual('path/uriparameter?hashtable[0].key=a&hashtable[0].value=b&hashtable[1].key=x&hashtable[1].value=y');
    });

    it('should render url with querystring, object type', function() {

        $rootScope.model.queryStringChunks = [
            {
                text: 'object',
                parameter: {
                    category: 'object',
                    value: {
                        a: 'b',
                        x: 'y'
                    }
                }
            }
        ];

        compile();

        expect(trim(element)).toEqual('path/uriparameter?a=b&x=y');
    });

    it('should render url with querystring, object type', function() {

        $rootScope.model.useFullyQualifiedNotation = true;

        $rootScope.model.queryStringChunks = [
            {
                text: 'object',
                parameter: {
                    category: 'object',
                    value: {
                        a: 'b',
                        x: 'y'
                    }
                }
            }
        ];

        compile();

        expect(trim(element)).toEqual('path/uriparameter?object.a=b&object.x=y');
    });

    function compile() {

        element = $compile('<div path-viewer model="model"></div>')($rootScope);

        $rootScope.$digest();
    }

    function trim(element) {

        return element
            .text()
            .replace(/(?:\r\n|\r|\n)/g, '')
            .replace(/\s/g, '');
    }
});
