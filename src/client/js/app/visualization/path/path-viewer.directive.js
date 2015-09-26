(function() {

    'use strict';

    angular
        .module('apinterest.path')
        .directive('pathViewer', PathViewer);

    function PathViewer() {

        return {
            restrict: 'A',
            scope: {
                model: '=model'
            },
            templateUrl: 'apinterest/content/js/app/visualization/path/path-viewer.html'
        };
    }
})();
