// Load native UI library
var gui = require('nw.gui');
var marked = require('marked');
var fs = require('fs');
var myWikiApp = angular.module('myWiki', ['ui.ace', 'treeControl']);
var files = myWikiCore.getFileTree();

myWikiCore.loadProject('/Users/lelandmiller/note-test');
console.log(files);
var setFileTree;

myWikiApp.controller('mainController', ['$scope', '$http', '$sce',
    function($scope, $http, $sce) {
        $scope.fileTree = myWikiCore.buildFileTree();
        $scope.currentFilename = "";
        $scope.content = "";
        $scope.setFileTree = function(newTree) {
            $scope.fileTree.length = 0;
            for (var i = 0; i < newTree.length; i++) {
                $scope.fileTree.push(newTree[i]);
            }
            $scope.$apply();
        };
        setFileTree = $scope.setFileTree;

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

        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
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
myWikiApp.directive("myProjectSelector", function() {
    return function($scope, $element, $attrs) {
        $element.change(function(evt) {
            var pathname = $element.val();
            console.log($element.val());
            myWikiCore.loadProject(pathname);
            setFileTree(myWikiCore.buildFileTree());
        });
    };
});


function generateFileElementMenu(fileElement, updateCallback) {
    var menu = new gui.Menu();
    menu.append(new gui.MenuItem({
        label: 'New Child Node'
    }));
    menu.append(new gui.MenuItem({
        label: 'New Sibling Node'
    }));
    menu.append(new gui.MenuItem({
        type: 'separator'
    }));
    menu.append(new gui.MenuItem({
        label: 'Delete Node'
    }));

    menu.items[0].click = function() {
        // New Child Node
        myWikiCore.createChildNode(fileElement);
        if (updateCallback) {
            updateCallback();
        }
        console.log('new child');
    };
    menu.items[1].click = function() {
        myWikiCore.createSiblingNode(fileElement);
        // New Sibling Node
        if (updateCallback) {
            updateCallback();
        }
        console.log('new sibling');
    };
    menu.items[3].click = function() {
        console.log('delete node');
    };
    return menu;
}

// Uses the node-webkit native api for the dropdown
myWikiApp.directive('myFileLink', function() {
    return {
        scope: {
            fileElement: '=myFileLink',
        },

        link: function($scope, $element, $attrs) {
            var menu = generateFileElementMenu($scope.fileElement, function() {
                setFileTree(myWikiCore.buildFileTree());
            });
            //$scope.test = 901928093;
            $element.bind('contextmenu', function(ev) {
                //console.log($scope.fileElement);
                ev.preventDefault();
                menu.popup(ev.x, ev.y);
                return false;
            });
        }

    };
});
