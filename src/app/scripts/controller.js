// Load native UI library
var gui = require('nw.gui');
var marked = require('marked');
var fs = require('fs');
var myWikiApp = angular.module('myWiki', ['ui.ace']);
var files = myWikiCore.getFileTree();

myWikiCore.loadProject('/Users/lelandmiller/note-test');
console.log(files);

myWikiApp.controller('mainController', ['$scope', '$http', '$sce',
    function($scope, $http, $sce) {
        $scope.items = myWikiCore.getFileTree();
        $scope.currentFilename = "";
        $scope.content = "";


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

        /*
        $scope.aceChanged = function(e) {
            console.log($scope.content);
            //$scope.preview = $sce.trustAsHtml(marked($scope.content));
        };
        */

        $scope.saveFile = function() {
            fs.writeFileSync($scope.currentFilename, $scope.content);
            console.log('save clicked');
        };
    }
]);

myWikiApp.directive("myPreview", function() {
    return function($scope, $element, $attrs) {
        //console.log('test:' + $attrs.myPreview);
        $scope.$watch($attrs.myPreview, function(value) {
            $element.html(marked($scope[$attrs.myPreview]));
            console.log('watch done');
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
        });
    };

});

function generateFileElementMenu() {
    var menu = new gui.Menu();
    menu.append(new gui.MenuItem({ label: 'New Child Node' }));
    menu.append(new gui.MenuItem({ label: 'New Sibling Node' }));
    menu.append(new gui.MenuItem({ type: 'separator' }));
    menu.append(new gui.MenuItem({ label: 'Delete Node' }));

    menu.items[0].click = function () {
        var title = prompt('Node Title', 'New Node');
        console.log('new child');
    };
    menu.items[1].click = function () {
        console.log('new sibling');
    };
    menu.items[3].click = function () {
        console.log('delete node');
    };
    return menu;
}

// Uses the node-webkit native api for the dropdown
myWikiApp.directive('myFileLink', function() {
    return function($scope, $element, $attrs) {
        var menu = generateFileElementMenu(); 
        $element.bind('contextmenu', function(ev) { 
            ev.preventDefault();
            menu.popup(ev.x, ev.y);
            return false;
        });

    };
});
