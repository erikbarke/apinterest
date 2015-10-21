describe('ValueValidator', function() {

    'use strict';

    var $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('apinterest.visualization');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });
    });

    it('should parse numeric value on edit', function() {

        $rootScope.validator = {
            category: 'numeric',
            pattern: /\d+/,
            minValue: 0,
            maxValue: 127
        };

        compile();

        element.val('42');
        element.triggerHandler('change');

        expect($rootScope.testform.testinput.$modelValue).toBe(42);
    });

    it('should parse numeric value on edit and handle undefined validator', function() {

        $rootScope.validator = undefined;

        compile();

        element.val('42');
        element.triggerHandler('change');

        expect($rootScope.testform.testinput.$modelValue).toBe('42');
    });

    it('should parse numeric value on edit and handle parse error', function() {

        $rootScope.validator = {
            category: 'numeric',
            pattern: /\d+/,
            minValue: 0,
            maxValue: 127
        };

        compile();

        element.val('"42":');
        element.triggerHandler('change');

        expect($rootScope.testform.testinput.$modelValue).toBeUndefined();
    });

    it('should not parse string values on edit', function() {

        $rootScope.validator = {
            category: 'string',
            pattern: /.*/
        };

        compile();

        element.val('abc123');
        element.triggerHandler('change');

        expect($rootScope.testform.testinput.$modelValue).toEqual('abc123');
    });

    it('should set input to valid if validator is undefined', function() {

        $rootScope.validator = undefined;

        compile();

        expect($rootScope.testform.testinput.$valid).toBeTruthy();
    });

    it('should set input to valid if validator pattern is undefined', function() {

        $rootScope.model = 'abc123';
        $rootScope.validator = {
            category: 'string'
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeTruthy();
    });

    it('should set empty input as valid', function() {

        $rootScope.model = '';
        $rootScope.validator = {
            category: 'string',
            pattern: /[a-c]+[1-3]+/
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeTruthy();
    });

    it('should handle undefined validator', function() {

        $rootScope.validator = undefined;

        compile();

        expect($rootScope.testform.testinput.$valid).toBeTruthy();
    });

    it('should validate valid string pattern', function() {

        $rootScope.model = 'abc123';
        $rootScope.validator = {
            category: 'string',
            pattern: /[a-c]+[1-3]+/
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeTruthy();
    });

    it('should not validate invalid string pattern', function() {

        $rootScope.model = 'xyz';
        $rootScope.validator = {
            category: 'string',
            pattern: /[a-c]+[1-3]+/
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeFalsy();
    });

    it('should validate valid numeric pattern', function() {

        $rootScope.model = '123';
        $rootScope.validator = {
            category: 'numeric',
            pattern: /\d+/,
            minValue: 0,
            maxValue: 127
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeTruthy();
    });

    it('should not validate invalid numeric pattern', function() {

        $rootScope.model = 'xxx';
        $rootScope.validator = {
            category: 'numeric',
            pattern: /\d+/,
            minValue: 0,
            maxValue: 127
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeFalsy();
    });

    it('should not validate invalid numeric min value', function() {

        $rootScope.model = '-1';
        $rootScope.validator = {
            category: 'numeric',
            pattern: /\d+/,
            minValue: 0,
            maxValue: 127
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeFalsy();
    });

    it('should not validate invalid numeric max value', function() {

        $rootScope.model = '999';
        $rootScope.validator = {
            category: 'numeric',
            pattern: /\d+/,
            minValue: 0,
            maxValue: 127
        };

        compile();

        expect($rootScope.testform.testinput.$valid).toBeFalsy();
    });

    function compile() {

        var formElement = $compile('<form name="testform"><input type="text" name="testinput" ng-model="model" value-validator="validator"/></form>')($rootScope);

        $rootScope.$digest();

        element = formElement.find('input');
    }
});
