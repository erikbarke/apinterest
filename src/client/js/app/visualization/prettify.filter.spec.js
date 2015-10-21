describe('Prettify', function() {

    'use strict';

    var prettify,
        mockSce,
        mockWindow,
        mockHighlight,
        mockObjectToPrettify,
        mockJsonFormattedObject;

    beforeEach(function() {

        module('apinterest.visualization');

        mockSce = {
            trustAsHtml: function(value) {
                return value;
            }
        };

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

        mockObjectToPrettify = { key: 'value' };

        mockJsonFormattedObject = '{\n' +
                               '  "key": "value"\n' +
                               '}';

        spyOn(mockSce, 'trustAsHtml').and.callThrough();
        spyOn(mockHighlight, 'highlightAuto').and.callThrough();

        module(function($provide) {

            $provide.value('$sce', mockSce);
            $provide.value('$window', mockWindow);
        });

        inject(function($injector, $filter) {

            prettify = $filter('prettify');
        });
    });

    it('should handle null values', function() {

        var prettified = prettify(null);

        expect(prettified).toBeNull();
    });

    it('should handle empty strings', function() {

        var prettified = prettify('');

        expect(prettified).toEqual('');
    });

    it('should format object literals as json', function() {

        var prettified = prettify(mockObjectToPrettify);

        expect(prettified).toEqual(mockJsonFormattedObject);
    });

    it('should replace linebreak literals with real linebreaks', function() {

        var prettified = prettify('row1\\nrow2');

        expect(prettified).toEqual('row1\nrow2');
    });

    it('should replace windows linebreak literals with real linebreaks', function() {

        var prettified = prettify('row1\\r\\nrow2');

        expect(prettified).toEqual('row1\nrow2');
    });

    it('should unescape escaped double quotes', function() {

        var prettified = prettify('\\"');

        expect(prettified).toEqual('"');
    });

    it('should unescape escaped slashes', function() {

        var prettified = prettify('\\\\');

        expect(prettified).toEqual('\\');
    });

    it('should syntax highlight', function() {

        prettify(mockObjectToPrettify);

        expect(mockHighlight.highlightAuto).toHaveBeenCalledWith(mockJsonFormattedObject);
    });

    it('should trust value as html', function() {

        prettify(mockObjectToPrettify);

        expect(mockSce.trustAsHtml).toHaveBeenCalledWith(mockJsonFormattedObject);
    });
});
