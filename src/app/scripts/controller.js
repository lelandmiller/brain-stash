var marked = require('marked');
var fs = require('fs');

var myWikiApp = angular.module('myWiki', ['ui.ace']);

var files = myWikiCore.getFileTree();

console.log(files);

myWikiApp.controller('mainController', ['$scope', '$http', '$sce',
    function($scope, $http, $sce) {
        $scope.items = files;
        $scope.currentFilename = "";
        $scope.content = "";
        $scope.preview = "";

        $scope.loadFile = function(entryObject) {
            var filepath = path.join(entryObject.path, entryObject.title + '.md'),
                content = "";
            $scope.currentFilename = filepath;
            if (fs.existsSync(filepath)) {
                content = fs.readFileSync(filepath, {
                    encoding: 'utf8'
                });
            }
            $scope.content = content;
        };

        $scope.aceChanged = function(e) {
            console.log($scope.content);
            $scope.preview = $sce.trustAsHtml(marked($scope.content));
        };

        $scope.saveFile = function() {
            fs.writeFileSync($scope.currentFilename, $scope.content);
            console.log('save clicked');
        };
    }
]);
