describe('singleValueEditor', function() {

    'use strict';

    var $compile,
        $rootScope,
        scope,
        element;

    beforeEach(function() {

        module('apinterest/content/js/app/visualization/single-value/single-value-editor.html');
        module('apinterest.single-value');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope').$new();
        });

        $rootScope.model = 'abc123';
    });

    it('should set form on scope', function() {

        compile();

        expect(scope.form.$name).toEqual('testform');
    });

    it('should set dropdown values for validator with predefined values', function() {

        $rootScope.validators = [{ values: [1, 2, 3] }];

        compile();

        expect(scope.dropdownValues).toEqual([1, 2, 3]);
    });

    it('should set boolean dropdown values for validator without predefined values', function() {

        $rootScope.validators = [{ }];

        compile();

        expect(scope.dropdownValues).toEqual([false, true]);
    });

    function compile() {

        var formElement = $compile('<form name="testform"><div single-value-editor model="model" name="name" validator="validators[0]"></div><form>')($rootScope);
        $rootScope.$digest();

        element = formElement.find('div');
        scope = element.isolateScope();
    }
});
