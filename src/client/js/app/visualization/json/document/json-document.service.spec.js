describe('JsonDocumentService', function() {

    'use strict';

    var jsonDocumentService;

    beforeEach(function() {

        module('apinterest.json-editor');

        inject(function($injector) {

            jsonDocumentService = $injector.get('JsonDocumentService');
        });
    });

    it('should render array value', function() {

        var value = [1, 2, 3],
            name = '',
            validators = [
                { path: '' }
            ],
            expected = '[<span class="indented"><div class="json-value" json-value-editor name="[0]" model="model.value[0]" validator="validators[0]"></div>,</span>' +
                        '<span class="indented"><div class="json-value" json-value-editor name="[1]" model="model.value[1]" validator="validators[0]"></div>,</span>' +
                        '<span class="indented"><div class="json-value" json-value-editor name="[2]" model="model.value[2]" validator="validators[0]"></div></span>]',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render object value', function() {

        var value = {
                a: 'b',
                x: 'y'
            },
            name = '',
            validators = [
                { path: '', type: 'com.example.domain.object' }
            ],
            expected = '{<span class="indented"><span class="json-property" title="com.example.domain.object">&quot;a&quot;</span>: ' +
                        '<div class="json-value" json-value-editor name="[\'a\']" model="model.value[\'a\']" validator="validators[0]"></div>,</span>' +
                        '<span class="indented"><span class="json-property" title="com.example.domain.object">&quot;x&quot;</span>: ' +
                        '<div class="json-value" json-value-editor name="[\'x\']" model="model.value[\'x\']" validator="validators[0]"></div></span>}',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render nested object value', function() {

        var value = {
                object: {
                    array: [
                        {
                            value: 'y'
                        }
                    ]
                }
            },
            name = '',
            validators = [
                { path: '', type: 'object' },
                { path: '[\'object\']', type: 'object' },
                { path: '[\'object\'][\'array\']', type: 'array' },
                { path: '[\'object\'][\'array\'][\'value\']', type: 'string' }
            ],
            expected = '{<span class="indented"><span class="json-property" title="object">&quot;object&quot;</span>: {' +
                           '<span class="indented"><span class="json-property" title="array">&quot;array&quot;</span>: [' +
                              '<span class="indented">{' +
                                 '<span class="indented"><span class="json-property" title="string">&quot;value&quot;</span>: ' +
                                 '<div class="json-value" json-value-editor name="[\'object\'][\'array\'][0][\'value\']" model="model.value[\'object\'][\'array\'][0][\'value\']" validator="validators[3]"></div></span>' +
                              '}</span>' +
                           ']</span>' +
                        '}</span>}',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render object value without validator type in title', function() {

        var value = {
                a: 'b'
            },
            name = '',
            validators = [
                { path: '' }
            ],
            expected = '{<span class="indented"><span class="json-property">&quot;a&quot;</span>: ' +
                        '<div class="json-value" json-value-editor name="[\'a\']" model="model.value[\'a\']" validator="validators[0]"></div></span>}',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render value', function() {

        var value = 'abc123',
            name = 'name',
            validators = [
                { path: '' }
            ],
            expected = '<div class="json-value" json-value-editor name="name" model="model.value" validator="validators[0]"></div>',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render value and handle validator not found', function() {

        var value = 'abc123',
            name = 'name',
            validators = [],
            expected = '<div class="json-value" json-value-editor name="name" model="model.value"></div>',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render value and handle HAL formatter _links', function() {

        var value = { _links: '_links' },
            name = 'name',
            validators = [
                { path: '[\'links\']', type: 'object' },
            ],
            expected = '{<span class="indented"><span class="json-property" title="object">&quot;_links&quot;</span>: ' +
                       '<div class="json-value" json-value-editor name="name[\'_links\']" model="model.value[\'_links\']" validator="validators[0]"></div></span>}',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });

    it('should render value and handle HAL formatter _embedded', function() {

        var value = { _embedded : '_embedded ' },
            name = 'name',
            validators = [
                { path: '[\'embedded \']', type: 'object' },
            ],
            expected = '{<span class="indented"><span class="json-property">&quot;_embedded&quot;</span>: ' +
                       '<div class="json-value" json-value-editor name="name[\'_embedded\']" model="model.value[\'_embedded\']"></div></span>}',
            html = jsonDocumentService.createHtml(value, name, validators);

        expect(html).toEqual(expected);
    });
});
