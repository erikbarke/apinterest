(function() {

    'use strict';

    angular
    .module('apinterest')
    .directive('viewContainer', ViewContainer);

    ViewContainer.$inject = ['$window'];

    function ViewContainer($window) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, viewContainerElement, attributes) {

            positionContainer();

            angular.element($window).bind('resize', function() {

                positionContainer();
            });

            function positionContainer () {

                var eightyPercentOfViewPort = 0.8,
                    horizontalMargin = 98,
                    viewHeaderHeight = 53,
                    viewBodyElement = getViewBody(viewContainerElement, attributes.viewBody),
                    viewContainerWidth = $window.innerWidth * eightyPercentOfViewPort,
                    viewContainerLeft = ($window.innerWidth - viewContainerWidth) / 2,
                    viewContainerMaxHeight = $window.innerHeight - (horizontalMargin * 1.5),
                    viewContainerTop = horizontalMargin;

                viewContainerElement.css({

                    'width': viewContainerWidth + 'px',
                    'left': viewContainerLeft + 'px',
                    'max-height': viewContainerMaxHeight + 'px',
                    'top': viewContainerTop + 'px'
                });

                viewBodyElement.css({

                    'max-height': (viewContainerMaxHeight - viewHeaderHeight) + 'px'
                });
            }
        }

        function getViewBody(viewContainerElement, viewBodyId) {

            var i,
                children = viewContainerElement.children();

            for (i = 0; i < children.length; i++) {

                /* istanbul ignore else */
                if (children[i].id === viewBodyId) {

                    return angular.element(children[i]);
                }
            }

            return angular.element();
        }
    }
})();
