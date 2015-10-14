describe('recent-history', function() {

    'use strict';

    var recentHistory,
        mockAesCtr,
        mockLocalStorage,
        mockWindow;

    beforeEach(function() {

        module('apinterest.recent-history');

        mockAesCtr = {
            encrypt: function() {

                return 'encrypted value';
            },
            decrypt: function() {

                return 'decrypted value';
            }
        };

        mockLocalStorage = {
            setItem: function() {

            },
            getItem: function() {

                return '{"username":"user","password":"encrypted value"}';
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
        spyOn(mockLocalStorage, 'setItem').and.callThrough();
        spyOn(mockLocalStorage, 'getItem').and.callThrough();
    });

    /*
    it('should encrypt user password', function() {

        storageService.setUserCredentials('user', 'pass', 'some/path');

        expect(mockAesCtr.encrypt).toHaveBeenCalledWith('pass', 'self-righteous cheese wheel banjo', 256);
    });

    it('should set user credentials', function() {

        storageService.setUserCredentials('user', 'pass', 'some/path');

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('credentials@some/path', '{"username":"user","password":"encrypted value"}');
    });

    it('should get user credentials', function() {

        storageService.getUserCredentials('some/path');

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('credentials@some/path');
    });

    it('should decrypt user password', function() {

        storageService.getUserCredentials('some/path');

        expect(mockAesCtr.decrypt).toHaveBeenCalledWith('encrypted value', 'self-righteous cheese wheel banjo', 256);
    });

    it('should get credentials for existing path, username', function() {

        var credentials = storageService.getUserCredentials('some/path');

        expect(credentials.username).toEqual('user');
    });

    it('should get credentials for existing path, password', function() {

        var credentials = storageService.getUserCredentials('some/path');

        expect(credentials.password).toEqual('decrypted value');
    });

    it('should handle non existing path, username', function() {

        mockLocalStorage.getItem = function() {
            return null;
        };

        var credentials = storageService.getUserCredentials('some/path');

        expect(credentials.username).toEqual('');
    });

    it('should handle non existing path, password', function() {

        mockLocalStorage.getItem = function() {
            return null;
        };

        var credentials = storageService.getUserCredentials('some/path');

        expect(credentials.password).toEqual('');
    });*/
});
