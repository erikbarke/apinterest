(function() {

    'use strict';

    angular
        .module('apinterest.visualization')
        .filter('prettify', Prettify);

    Prettify.$inject = ['$sce', '$window'];

    function Prettify($sce, $window) {

        return function(input) {

            if (input === null) {

                return null;
            }

            var prettified = angular.isObject(input) ? JSON.stringify(input, null, 2) : input;

            prettified = prettified.toString();
            prettified = prettified.replace(/(\\r)?\\n/g, '\n');
            prettified = prettified.replace(/\\"/g, '"');
            prettified = prettified.replace(/\\\\/g, '\\');

            return $sce.trustAsHtml(prettified);
        };
    }
})();
