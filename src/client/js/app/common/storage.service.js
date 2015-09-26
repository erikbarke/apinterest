(function() {

    'use strict';

    angular
        .module('apinterest.common')
        .factory('StorageService', StorageService);

    StorageService.$inject = ['$window'];

    function StorageService($window) {

        var storagePassPhrase = 'self-righteous cheese wheel banjo',
            keybits = 256;

        return {
            setUserCredentials: setUserCredentials,
            getUserCredentials: getUserCredentials
        };

        function setUserCredentials(username, password, key) {

            var credentials = JSON.stringify({
                username: username,
                password: $window.Aes.Ctr.encrypt(password, storagePassPhrase, keybits)
            });

            $window.localStorage.setItem('credentials@' + key, credentials);
        }

        function getUserCredentials(key) {

            var item = $window.localStorage.getItem('credentials@' + key),
                credentials = JSON.parse(item) || {};

            if (credentials.username && credentials.password) {

                credentials.password = $window.Aes.Ctr.decrypt(credentials.password, storagePassPhrase, keybits);
            }
            else {

                credentials.username = '';
                credentials.password = '';
            }

            return credentials;
        }
    }
})();
