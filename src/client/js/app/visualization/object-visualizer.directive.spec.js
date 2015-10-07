describe('objectVisualizer', function() {

    'use strict';

    var mockHighlight,
        mockWindow,
        $compile,
        $rootScope,
        element;

    beforeEach(function() {

        module('apinterest/content/js/app/visualization/object-visualizer.html');
        module('apinterest.visualization');

        mockHighlight = {
            highlightAuto: function(value) {
                return {
                    value: value
                };
            }
        };

        mockWindow = {
            hljs: mockHighlight
        };

        module(function($provide) {

            $provide.value('$window', mockWindow);
        });

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        $rootScope.model = {
            value: 'abc123'
        };
    });

    it('should use json editor for visualization type "json"', function() {

        $rootScope.visualizationType = 'json';

        compile();

        expect(element[0].querySelector('div[json-editor]').outerHTML)
            .toEqual('<div json-editor="" model="model" name="name" validators="validators"></div>');
    });

    it('should use json editor for visualization type "single-value"', function() {

        $rootScope.visualizationType = 'single-value';

        compile();

        expect(element[0].querySelector('div[single-value-editor]').outerHTML)
            .toEqual('<div single-value-editor="" model="model" name="name" validator="validators[0]"></div>');
    });

    it('should use json editor for visualization type "text"', function() {

        $rootScope.visualizationType = 'text';

        compile();

        expect(element[0].querySelector('pre').outerHTML)
            .toEqual('<pre ng-if="visualizationType === \'text\'" ng-bind-html="model.value | prettify" class="text-viewer ng-binding ng-scope">abc123</pre>');
    });

    function compile() {

        element = $compile('<div object-visualizer model="model" name="name" display-name="displayName" type="type" visualization-type="visualizationType" validators="validators"></div>')($rootScope);

        $rootScope.$digest();
    }
});
