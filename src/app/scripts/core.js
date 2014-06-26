var fs = require('fs');
var path = require('path');
var underscore = require('underscore');

var myWikiCore = (function() {
    my = {};
    rootDir = '/Users/lelandmiller/note-test';
    /* { title:
     *   path
     *   children: [{}]
     *   }
     *
     *
     */

    function makeEntryObject(fullPath) {
        var ext = path.extname(fullPath),
            title = path.basename(fullPath, ext),
            children = null,
            ret = {
                title: title,
                path: path.dirname(fullPath)
            };

        if (fs.statSync(fullPath).isDirectory()) {
            ret.children = my.getFileTree(fullPath);
            return ret;
        } else if (ext === '.md') {
            return ret;
        }

        return null;
    }

    my.getFileTree = function (currPath) {
        if (!currPath) currPath = rootDir;
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
    };

    my.loadProject = function (currPath) {
        rootDir = currPath;
    };

    return my;
})();
