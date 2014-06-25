var myWiki = angular.module('myWiki', []);
var core = require('./scripts/core.js');
files = core.getFileTree();
console.log(files);

function mainController($scope, $http) {
    $scope.test = "hello";
    $scope.items = files;
    $scope.loadFile = function (filename) {
        console.log(filename);
    };
}


