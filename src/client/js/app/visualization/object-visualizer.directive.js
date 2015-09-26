(function() {

    'use strict';

    angular
        .module('apinterest.visualization')
        .directive('objectVisualizer', ObjectVisualizer);

    function ObjectVisualizer() {

        return {
            restrict: 'A',
            scope: {
                model: '=model',
                name: '=name',
                displayName: '=displayName',
                type: '=type',
                visualizationType: '=visualizationType',
                validators: '=validators'
            },
            templateUrl: 'apinterest/content/js/app/visualization/object-visualizer.html'
        };
    }
})();
