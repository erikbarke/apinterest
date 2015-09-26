describe('json-value-editor.directive', function() {

    'use strict';

    var $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('html2js.unittest.templates');
        module('apinterest.json-editor');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $rootScope.model = {
            value: {
                location: 'abc123'
            }
        };

        element = $compile('<form name="testform"><div json-value-editor name="name" model="model" validator="validator"></div><form>')($rootScope);
        $rootScope.$digest();
    });

    it('should set form on scope', function() {

    });
});
