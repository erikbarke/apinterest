describe('jsonEditor', function() {

    'use strict';

    var $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('apinterest/content/js/app/visualization/json/json-editor.html');
        module('apinterest.json-editor');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $rootScope.model = {};

        var formElement = $compile('<form name="testform"><div json-editor model="model" name="name" validators="validators"></div></form>')($rootScope);

        $rootScope.$digest();

        element = formElement.find('div');
    });

    it('should set form on scope', function() {

        expect(element.isolateScope().form.$name).toEqual('testform');
    });
});