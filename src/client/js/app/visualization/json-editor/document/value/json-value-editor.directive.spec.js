describe('JsonValueEditor', function() {

    'use strict';

    var $compile,
        $rootScope,
        $timeout,
        scope,
        element;

    beforeEach(function() {

        module('apinterest/content/js/app/visualization/json-editor/document/value/json-value-editor.html');
        module('apinterest.visualization.json-editor');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        $rootScope.model = {
            value: {
                location: 'abc123'
            }
        };
    });

    it('should expose form on scope', function() {

        compile();

        expect(scope.form.$name).toEqual('testform');
    });

    it('should get placeholder for undefined', function() {

        compile();

        var placeholder = scope.getPlaceholder(undefined);

        expect(placeholder).toEqual('invalid');
    });

    it('should get placeholder for null', function() {

        compile();

        var placeholder = scope.getPlaceholder(null);

        expect(placeholder).toEqual('null');
    });

    it('should get placeholder for empty string', function() {

        compile();

        var placeholder = scope.getPlaceholder('');

        expect(placeholder).toEqual('empty');
    });

    it('should set model', function() {

        compile();

        scope.setModel('abc123');

        expect(scope.model).toEqual('abc123');
    });

    it('should toggle popup', function() {

        compile();

        scope.togglePopup();

        expect(scope.popupVisible).toBeTruthy();

        scope.togglePopup();

        expect(scope.popupVisible).toBeFalsy();
    });

    it('should toggle popup and set caret position', function() {

        compile();

        var input = element.find('input');
        input.val('abc123');

        scope.togglePopup();
        $timeout.flush();

        expect(input[0].selectionStart).toEqual(6);
    });

    it('should close popup', function() {

        compile();

        scope.closePopup();

        expect(scope.popupVisible).toBeFalsy();
    });

    it('should get left quote for undefined', function() {

        compile();

        var leftQuote = scope.getLeftQuote(undefined);

        expect(leftQuote).toEqual('<');
    });

    it('should get left quote for empty string', function() {

        compile();

        var leftQuote = scope.getLeftQuote('');

        expect(leftQuote).toEqual('<');
    });

    it('should get left quote for null', function() {

        compile();

        var leftQuote = scope.getLeftQuote(null);

        expect(leftQuote).toEqual('');
    });

    it('should get left quote for string', function() {

        compile();

        scope.validator = { category: 'string' };

        var leftQuote = scope.getLeftQuote('abc123');

        expect(leftQuote).toEqual('"');
    });

    it('should get right quote for undefined', function() {

        compile();

        var rightQuote = scope.getRightQuote(undefined);

        expect(rightQuote).toEqual('>');
    });

    it('should get right quote for empty string', function() {

        compile();

        var rightQuote = scope.getRightQuote('');

        expect(rightQuote).toEqual('>');
    });

    it('should get right quote for null', function() {

        compile();

        var rightQuote = scope.getRightQuote(null);

        expect(rightQuote).toEqual('');
    });

    it('should get right quote for string', function() {

        compile();

        scope.validator = { category: 'string' };

        var rightQuote = scope.getRightQuote('abc123');

        expect(rightQuote).toEqual('"');
    });

    it('should set dropdown values for validator with predefined values', function() {

        $rootScope.validator = {
            values: [
                'a',
                'b',
                'c'
            ]
        };

        compile();

        expect(scope.dropdownValues).toEqual(['a', 'b', 'c']);
    });

    it('should set boolean dropdown values for validator without predefined values', function() {

        $rootScope.validator = {};

        compile();

        expect(scope.dropdownValues).toEqual([false, true]);
    });

    it('should close editor on keypress enter', function() {

        compile();
        scope.togglePopup();

        element.triggerHandler({
            type: 'keypress',
            keyCode: 13
        });

        scope.$digest();

        expect(scope.popupVisible).toBeFalsy();
    });

    it('should keep editor open while typing', function() {

        compile();
        scope.togglePopup();

        element.triggerHandler({
            type: 'keypress',
            keyCode: 97
        });

        expect(scope.popupVisible).toBeTruthy();
    });

    function compile() {

        var formElement = $compile('<form name="testform"><div json-value-editor name="name" model="model" validator="validator"></div><form>')($rootScope);
        $rootScope.$digest();

        element = formElement.find('div');
        scope = element.isolateScope();
    }
});
