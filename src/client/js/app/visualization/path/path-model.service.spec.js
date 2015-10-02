describe('path-model-service', function() {

    'use strict';

    var pathModelService;

    beforeEach(function() {

        module('apinterest.path');

        inject(function($injector) {

            pathModelService = $injector.get('PathModelService');
        });
    });

    it('should create absolute path chunks', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.absolutePathChunks.length).toEqual(2);
    });

    it('should create absolute path chunk with text only', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.absolutePathChunks[0].text).toEqual('path/');
        expect(model.absolutePathChunks[0].parameter).toBeNull();
    });

    it('should create absolute path chunk with no parameter', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.absolutePathChunks[0].text).toEqual('path/');
        expect(model.absolutePathChunks[0].parameter).toBeNull();
    });

    it('should create absolute path chunk with text', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.absolutePathChunks[1].text).toEqual('{uriparameter}');
    });

    it('should create absolute path chunk with parameter name', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.absolutePathChunks[1].parameter.name).toEqual('uriparameter');
    });

    it('should create absolute path chunks without query string chunks', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.queryStringChunks.length).toEqual(0);
    });

    it('should create absolute path and not use fully qualified notation', function() {

        var parameters = [{ name: 'uriparameter' }],
            model = pathModelService.getModel('path/{uriparameter}', parameters);

        expect(model.useFullyQualifiedNotation).toBeFalsy();
    });

    it('should create query string', function() {

        var parameters = [{ name: 'queryparameter', source: 'FromUri' }],
            model = pathModelService.getModel('path?queryparameter=value', parameters);

        expect(model.queryStringChunks.length).toEqual(1);
    });

    it('should create query string with text', function() {

        var parameters = [
                { name: 'id', source: 'FromUri' },
                { name: 'key', source: 'FromUri' }
            ],
            model = pathModelService.getModel('path/{id}?key=value', parameters);

        expect(model.queryStringChunks[0].text).toEqual('key');
    });

    it('should create query string with parameter name', function() {

        var parameters = [
                { name: 'id', source: 'FromUri' },
                { name: 'key', source: 'FromUri' }
            ],
            model = pathModelService.getModel('path/{id}?key=value', parameters);

        expect(model.queryStringChunks[0].parameter.name).toEqual('key');
    });

    it('should create query string with parameter source', function() {

        var parameters = [
                { name: 'id', source: 'FromUri' },
                { name: 'key', source: 'FromUri' }
            ],
            model = pathModelService.getModel('path/{id}?key=value', parameters);

        expect(model.queryStringChunks[0].parameter.source).toEqual('FromUri');
    });

    it('should use fully qualified notation if query string has more than one complex object', function() {

        var parameters = [
                { name: 'id', source: 'FromUri', category: 'object' },
                { name: 'key', source: 'FromUri', category: 'object' },
                { name: 'x', source: 'FromUri', category: 'simple' }
            ],
            model = pathModelService.getModel('path?id=1&key=value', parameters);

        expect(model.useFullyQualifiedNotation).toBeTruthy();
    });
});
