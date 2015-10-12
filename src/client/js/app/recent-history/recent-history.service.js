(function() {

    'use strict';

    angular
        .module('apinterest.recent-history')
        .factory('RecentHistory', RecentHistory);

    RecentHistory.$inject = ['$window', 'PathModelService'];

    function RecentHistory($window, pathModelService) {

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
            requestRunnerModel.recentHistoryList = get(requestRunnerModel.id);
        }

        function get(id) {

            var recentHistoryList = [],
                storedHistory = getFromStorage(id);

            angular.forEach(storedHistory, function(historyItem) {

                recentHistoryList.push(unpack(historyItem));
            });

            return recentHistoryList;
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

        function pack(requestRunnerModel) {

            var parameters = angular.copy(requestRunnerModel.parameters);

            angular.forEach(parameters, function(parameter) {

                angular.forEach(parameter.validators, function(validator) {

                    if (validator.pattern) {

                        validator.patternString = validator.pattern.source;
                        delete validator.pattern;
                    }
                });
            });

            return {
                date: new Date(),
                path: requestRunnerModel.path,
                parameters: parameters,
                username: requestRunnerModel.username,
                password: $window.Aes.Ctr.encrypt(requestRunnerModel.password, storagePassPhrase, keybits)
            };
        }

        function unpack(recentHistoryItem) {

            angular.forEach(recentHistoryItem.parameters, function(parameter) {

                angular.forEach(parameter.validators, function(validator) {

                    if (validator.patternString) {

                        validator.pattern = new RegExp(validator.patternString);
                        delete validator.patternString;
                    }
                });
            });

            return {
                date: new Date(recentHistoryItem.date),
                pathModel: pathModelService.getModel(recentHistoryItem.path, recentHistoryItem.parameters),
                parameters: recentHistoryItem.parameters,
                username: recentHistoryItem.username,
                password: $window.Aes.Ctr.decrypt(recentHistoryItem.password, storagePassPhrase, keybits)
            };
        }
    }
})();
