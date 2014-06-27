    /* { title:
     *   path
     *   children: [{}]
     *   real: 
     *   active:
     *   }
     */
var fs = require('fs');
var path = require('path');
var underscore = require('underscore');

var myWikiCore = (function() {
    var my = {},
        rootDir = '',
        currentEntry = null,
        fileTree = null;

    // Used for building initial path tree
    function makeEntryObject(fullPath) {
        var ext = path.extname(fullPath),
            title = path.basename(fullPath, ext),
            children = null,
            ret = {
                title: title,
                path: path.dirname(fullPath)
            };

        if (fs.statSync(fullPath).isDirectory()) {
            ret.children = buildFileTree(fullPath);
            return ret;
        } else if (ext === '.md') {
            return ret;
        }

        return null;
    }
    function buildFileTree(currPath) {
        var ret = [],
            files = fs.readdirSync(currPath),
            i,
            currentFile;
        for (i = 0; i < files.length; i++) {
            var newEntry = makeEntryObject(path.join(currPath, files[i])),
                existing = underscore.findWhere(ret, {
                    title: newEntry.title
                });

            if (existing) {
                existing.children = existing.children || newEntry.children;
            } else {
                ret.push(newEntry);
            }
        }
        return ret;
    }



    my.getFileTree = function () {
        return fileTree;
    };

    my.loadProject = function (projectPath) {
        rootDir = projectPath;
        fileTree = buildFileTree(rootDir); 
    };

    return my;
})();
