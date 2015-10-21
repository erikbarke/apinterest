(function() {

    'use strict';

    angular
        .module('apinterest.file')
        .factory('FileService', FileService);

    FileService.$inject = ['$window', 'MediaType'];

    function FileService($window, mediaType) {

        return {
            initializeUploadRequest: initializeUploadRequest,
            saveResponseAsFile: saveResponseAsFile
        };

        function initializeUploadRequest(request, files) {

            var formData,
                file,
                i;

            formData = new FormData();

            for (i = 0; i < files.length; i++) {

                file = files[i];

                formData.append('file' + i, file.data, file.name);
            }

            request.headers['Content-Type'] = undefined;
            request.transformRequest = angular.identity;
            request.data = formData;
        }

        function saveResponseAsFile(data, contentType) {

            var blob = new $window.Blob([data], { type: contentType }),
                fileExtension = getFileExtension(contentType);

            $window.saveAs(blob, 'apinterest-response' + fileExtension);
        }

        function getFileExtension(contentType) {

            var fileExtensions;

            if (contentType) {

                contentType = contentType.replace(/"+/g, '');
                fileExtensions = mediaType[contentType];

                if (fileExtensions) {

                    return fileExtensions[0];
                }
            }

            return '';
        }
    }
})();
