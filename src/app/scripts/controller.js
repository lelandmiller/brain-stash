var core = require('./scripts/core.js');
var marked = require('marked');
var fs = require('fs');

var myWiki = angular.module('myWiki', ['ui.ace']);

var files = core.getFileTree();

console.log(files);

function mainController($scope, $http, $sce) {
    $scope.items = files;
    $scope.currentFilename = "";

    $scope.content = "# Welcome";
    $scope.preview = "";

    $scope.loadFile = function (filename) {
        $scope.currentFilename = filename;
        $scope.content = fs.readFileSync(filename, {
            encoding: 'utf8'
        });
        console.log(filename);
    };

    $scope.aceChanged = function (e) {
        console.log($scope.content);
        $scope.preview = $sce.trustAsHtml(marked($scope.content));
    };

    $scope.saveFile = function () {
        fs.writeFileSync($scope.currentFilename, $scope.content);
        console.log('save clicked');
    };
}
