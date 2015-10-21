describe('PathRenderService', function() {

    'use strict';

    var pathRenderService,
        mockPathModel;

    beforeEach(function() {

        module('apinterest.visualization.path');

        mockPathModel = {

            absolutePathChunks: [
                {
                    text: 'path/'
                },
                {
                    id: '{id}',
                    parameter: {
                        name: '{id}',
                        value: 42
                    }
                }
            ],
            queryStringChunks: []
        };

        inject(function($injector) {

            pathRenderService = $injector.get('PathRenderService');
        });
    });

    it('should render absolute path', function() {

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42');
    });

    it('should render query string with simple parameter', function() {

        mockPathModel.queryStringChunks = [

            {
                text: 'key',
                parameter: {
                    category: 'simple',
                    value: 'value'
                }
            }
        ];

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?key=value');
    });

    it('should render query string with array parameter', function() {

        mockPathModel.queryStringChunks = [

            {
                text: 'array',
                parameter: {
                    category: 'array',
                    value: [0, 1, 2]
                }
            }
        ];

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?array[0]=0&array[1]=1&array[2]=2');
    });

    it('should render query string with array parameter', function() {

        mockPathModel.queryStringChunks = [

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

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?hashtable[0].key=a&hashtable[0].value=b&hashtable[1].key=x&hashtable[1].value=y');
    });

    it('should render query string with object parameter', function() {

        mockPathModel.useFullyQualifiedNotation = false;

        mockPathModel.queryStringChunks = [

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

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?a=b&x=y');
    });

    it('should render query string with object parameter and handle null values', function() {

        mockPathModel.useFullyQualifiedNotation = false;

        mockPathModel.queryStringChunks = [

            {
                text: 'object',
                parameter: {
                    category: 'object',
                    value: {
                        x: undefined
                    }
                }
            }
        ];

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?x=');
    });

    it('should render query string with object parameter and use fully qualified notation', function() {

        mockPathModel.useFullyQualifiedNotation = true;

        mockPathModel.queryStringChunks = [

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

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?object.a=b&object.x=y');
    });

    it('should render query string multiple parameters', function() {

        mockPathModel.queryStringChunks = [

            {
                text: 'key1',
                parameter: {
                    category: 'simple',
                    value: 'value1'
                }
            },
            {
                text: 'key2',
                parameter: {
                    category: 'simple',
                    value: 'value2'
                }
            }
        ];

        var url = pathRenderService.renderUrlString(mockPathModel);

        expect(url).toEqual('path/42?key1=value1&key2=value2');
    });
});
