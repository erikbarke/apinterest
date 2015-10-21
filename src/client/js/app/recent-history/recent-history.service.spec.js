describe('recent-history', function() {

    'use strict';

    var recentHistory,
        mockRequestRunnerModel,
        mockDate,
        mockAesCtr,
        mockLocalStorage,
        mockWindow;

    beforeEach(function() {

        module('apinterest.recent-history');

        mockRequestRunnerModel = {
            id: 'GETsome/path',
            username: 'abc',
            password: 'xyz',
            downloadResponseAsFile: true,
            parameters: [
                { name: 'customer', value: 'Acme' }
            ]
        };

        mockDate = new Date('2015-05-27');

        mockAesCtr = {
            encrypt: function() {

                return 'encrypted value';
            },
            decrypt: function() {

                return 'decrypted value';
            }
        };

        mockLocalStorage = {

            mockDatabase: {
                'recent@GETsome/path': JSON.stringify([
                    {
                        date: mockDate.toISOString(),
                        downloadResponseAsFile: true,
                        username: 'abc',
                        password: 'encrypted value',
                        parameters: [
                            { name: 'customer', value: 'Acme' },
                            { name: 'customer', value: 'BigCorp' }
                        ]
                    },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'encrypted value', parameters: [] },
                    { date: mockDate.toISOString(), username: 'abc', password: 'xencrypted value', parameters: [] }
                ])
            },

            setItem: function(key, value) {

                mockLocalStorage.mockDatabase[key] = value;
            },
            getItem: function(key) {

                return mockLocalStorage.mockDatabase[key] || null;
            }
        };

        mockWindow = {
            Aes: {

                Ctr: mockAesCtr
            },
            localStorage: mockLocalStorage
        };

        module(function($provide) {

            $provide.value('$window', mockWindow);
        });

        inject(function($injector) {

            recentHistory = $injector.get('RecentHistory');
        });

        spyOn(mockAesCtr, 'encrypt').and.callThrough();
        spyOn(mockAesCtr, 'decrypt').and.callThrough();
        spyOn(mockLocalStorage, 'getItem').and.callThrough();

        jasmine.clock().mockDate(mockDate);
    });

    it('should save request runner model and get recent history list from local storage', function() {

        recentHistory.save(mockRequestRunnerModel);

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('recent@GETsome/path');
    });

    it('should save request runner model and save to local storage, date', function() {

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored[0].date).toEqual(mockDate.toISOString());
    });

    it('should save request runner model and save to local storage, downloadResponseAsFile', function() {

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored[0].downloadResponseAsFile).toBeTruthy();
    });

    it('should save request runner model and save to local storage, username', function() {

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored[0].username).toEqual('abc');
    });

    it('should save request runner model and save to local storage, password', function() {

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored[0].password).toEqual('encrypted value');
    });

    it('should save request runner model and save to local storage and AES encrypt password', function() {

        recentHistory.save(mockRequestRunnerModel);

        expect(mockAesCtr.encrypt).toHaveBeenCalledWith('xyz', 'self-righteous cheese wheel banjo', 256);
    });

    it('should save request runner model and save to local storage and handle empty password', function() {

        mockRequestRunnerModel.password = undefined;

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored[0].password).toEqual('');
    });

    it('should save request runner model and save to local storage, parameters', function() {

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored[0].parameters[0]).toEqual({ name: 'customer', value: 'Acme' });
    });

    it('should save request runner model and truncate history list exceeding max size', function() {

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored.length).toEqual(10);
    });

    it('should save request runner model and keep history list under max size', function() {

        mockLocalStorage.mockDatabase = {
            'recent@GETsome/path': JSON.stringify([
                { name: 'customer', value: 'BigCorp' }
            ])
        };

        recentHistory.save(mockRequestRunnerModel);

        var stored = JSON.parse(mockLocalStorage.mockDatabase['recent@GETsome/path']);

        expect(stored.length).toEqual(2);
    });

    it('should get recent history list from local storage', function() {

        recentHistory.get(mockRequestRunnerModel.id);

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('recent@GETsome/path');
    });

    it('should get recent history list from local storage and handle non existing key', function() {

        var recentHistoryList = recentHistory.get('does-not-exist');

        expect(recentHistoryList.length).toEqual(0);
    });

    it('should get recent history list and set date', function() {

        var recentHistoryList = recentHistory.get(mockRequestRunnerModel.id);

        expect(recentHistoryList[0].date).toEqual(mockDate);
    });

    it('should get recent history list and set username', function() {

        var recentHistoryList = recentHistory.get(mockRequestRunnerModel.id);

        expect(recentHistoryList[0].downloadResponseAsFile).toBeTruthy();
    });

    it('should get recent history list and set username', function() {

        var recentHistoryList = recentHistory.get(mockRequestRunnerModel.id);

        expect(recentHistoryList[0].username).toEqual('abc');
    });

    it('should get recent history list and decrypt password', function() {

        recentHistory.get(mockRequestRunnerModel.id);

        expect(mockAesCtr.decrypt).toHaveBeenCalledWith('encrypted value', 'self-righteous cheese wheel banjo', 256);
        expect(mockAesCtr.decrypt.calls.count()).toEqual(10);
    });

    it('should get recent history list and set password', function() {

        var recentHistoryList = recentHistory.get(mockRequestRunnerModel.id);

        expect(recentHistoryList[0].password).toEqual('decrypted value');
    });

    it('should get recent history list and set parameters', function() {

        var recentHistoryList = recentHistory.get(mockRequestRunnerModel.id);

        expect(recentHistoryList[0].parameters[0].value).toEqual('Acme');
    });
});
