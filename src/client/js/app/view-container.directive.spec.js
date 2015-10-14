describe('view-container.directive', function() {

    'use strict';

    var $compile,
        $document,
        $rootScope,
        $window,
        template = '<div view-container view-body="view-body"><div id="view-body"></div></div>';

    beforeEach(function() {

        module('apinterest');

        inject(function($injector) {

            $compile = $injector.get('$compile');
            $document = $injector.get('$document');
            $rootScope = $injector.get('$rootScope');
            $window = $injector.get('$window');
        });

        $window.innerWidth = 1000;
        $window.innerHeight = 1000;
    });

    it('should position the container, top', function() {

        var element = $compile(template)($rootScope);

        expect(element[0].style.top).toEqual('96px');
    });

    it('should position the container, max-height', function() {

        var element = $compile(template)($rootScope);

        expect(element[0].style.maxHeight).toEqual('856px');
    });

    it('should position the container, width', function() {

        var element = $compile(template)($rootScope);

        expect(element[0].style.width).toEqual('800px');
    });

    it('should position the container, left', function() {

        var element = $compile(template)($rootScope);

        expect(element[0].style.left).toEqual('100px');
    });

    it('should position the container, height', function() {

        var element = $compile(template)($rootScope);

        expect(element[0].style.height).not.toBeUndefined();
    });

    it('should set container body max-height', function() {

        var element = $compile(template)($rootScope),
            viewBody = element.find('div');

        expect(viewBody[0].style.maxHeight).toEqual('803px');
    });

    it('should handle non existing view body', function() {

        var element = $compile('<div view-container></div>')($rootScope);

        expect(element[0].style.left).toEqual('100px');
    });

    it('should position view container on resize', function() {

        var element = $compile('<div view-container></div>')($rootScope);

        $window.innerWidth = 500;
        angular.element($window).triggerHandler('resize');

        expect(element[0].style.left).toEqual('50px');
    });
});
