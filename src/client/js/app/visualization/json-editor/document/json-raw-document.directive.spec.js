describe('jsonRawDocument', function() {

    'use strict';

    var $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('apinterest.visualization.json-editor');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });
    });

    it('should render model as json text document', function() {

        $rootScope.model = {
            value: {
                a: 'b'
            }
        };

        compile();

        expect(element.text()).toEqual('{\n' +
                                       '  "a": "b"\n' +
                                       '}');
    });

    it('should parse and validate json text document on keydown event', function() {

        compile();

        createInvalidJsonInput();
        createValidJsonInput('keydown');
    });

    it('should parse and validate json text document on keyup event', function() {

        compile();

        createInvalidJsonInput();
        createValidJsonInput('keyup');
    });

    it('should parse and validate json text document on change event', function() {

        compile();

        createInvalidJsonInput();
        createValidJsonInput('change');
    });

    it('should parse and validate json text document on paste event', function() {

        compile();

        createInvalidJsonInput();
        createValidJsonInput('paste');
    });

    it('should set modelvalue', function() {

        compile();

        createValidJsonInput('keydown');

        expect($rootScope.testform.testdocument.$modelValue).toEqual({ a: 'b' });
    });

    function createValidJsonInput(event) {

        element.text('{ "a": "b" }');
        element.triggerHandler(event);
        $rootScope.$digest();

        expect($rootScope.testform.testdocument.$valid).toBeTruthy();
    }

    function createInvalidJsonInput() {

        element.text('{ "a": ');
        element.triggerHandler('keydown');
        $rootScope.$digest();

        expect($rootScope.testform.testdocument.$valid).toBeFalsy();
    }

    function compile() {

        var formElement = $compile('<form name="testform"><pre class="json-editor" json-raw-document name="testdocument" ng-model="model.value"></pre></form>')($rootScope);

        $rootScope.$digest();

        element = formElement.find('pre');
    }
});
