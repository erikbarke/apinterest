(function() {

    'use strict';

    angular
        .module('apinterest.recent-history')
        .factory('RecentHistory', RecentHistory);

    RecentHistory.$inject = ['$window'];

    function RecentHistory($window) {

        var storagePassPhrase = 'self-righteous cheese wheel banjo',
            keybits = 256,
            maxRecentListLength = 10;

        return {
            save: save,
            get: get
        };

        function save(requestRunnerModel) {

            var recentHistoryList = getFromStorage(requestRunnerModel.id),
                recentHistoryItem = pack(requestRunnerModel);

            recentHistoryList.unshift(recentHistoryItem);

            if (recentHistoryList.length > maxRecentListLength) {

                recentHistoryList.length = maxRecentListLength;
            }

            saveToStorage(requestRunnerModel.id, recentHistoryList);
        }

        function get(id) {

            var recentHistoryList = [],
                recentHistoryItem,
                storedHistory = getFromStorage(id),
                i;

            for (i = 0; i < storedHistory.length; i++) {

                recentHistoryItem = unpack(storedHistory[i]);
                recentHistoryList.push(recentHistoryItem);
            }

            return recentHistoryList;
        }

        function pack(requestRunnerModel) {

            var parameters = [],
                i;

            for (i = 0; i < requestRunnerModel.parameters.length; i++) {

                parameters.push({

                    name: requestRunnerModel.parameters[i].name,
                    value: requestRunnerModel.parameters[i].value,
                });
            }

            return {
                date: new Date(),
                parameters: parameters,
                username: requestRunnerModel.username,
                password: $window.Aes.Ctr.encrypt(requestRunnerModel.password, storagePassPhrase, keybits)
            };
        }

        function unpack(recentHistoryItem) {

            return {
                date: new Date(recentHistoryItem.date),
                parameters: recentHistoryItem.parameters,
                username: recentHistoryItem.username,
                password: $window.Aes.Ctr.decrypt(recentHistoryItem.password, storagePassPhrase, keybits)
            };
        }

        function getFromStorage(id) {

            var key = createStorageKey(id),
                storedJson = $window.localStorage.getItem(key);

            return JSON.parse(storedJson) || [];
        }

        function saveToStorage(id, recentHistoryList) {

            var key = createStorageKey(id);

            $window.localStorage.setItem(key, JSON.stringify(recentHistoryList));
        }

        function createStorageKey(id) {

            return 'recent@' + id;
        }
    }
})();
