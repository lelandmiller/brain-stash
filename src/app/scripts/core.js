var fs = require('fs');
rootDir = '/Users/lelandmiller/note-test';
/* { title:
 *   children: [{}]
 *   }
 *
 *
 */

// TODO path.join instead
function getFileTree(path) {
    if (!path) path = rootDir;
    var ret = [],
        files = fs.readdirSync(path),
        i,
        currentFile;
    for (i = 0; i < files.length; i++) {
        currentFile = {
            title: files[i]
        };
        var fullPath = path + '/' + files[i];
        if (fs.statSync(fullPath).isDirectory()) {
            currentFile.children = getFileTree(fullPath);
        }
        ret.push(currentFile);
    }
    return ret;
}

function loadProject(path) {
    rootDir = path;
}

module.exports.loadProject = loadProject;

module.exports.getFileTree = getFileTree;
