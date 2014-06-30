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
//var buffer = require('buffer');

//http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
function toBuffer(ab) {
    //var buffer = new Buffer(ab.size);
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

// http://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
// window.addEventListener('paste', ... or
document.onpaste = function(event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    var blob = items[0].getAsFile();
    var reader = new FileReader();
    /*
    reader.onload = function(event) {
        console.log(event.target.result)
    }; // data url!
    var a = reader.readAsDataURL(blob);
*/
/*
    reader.onload = function(event) {
        console.log(event.target.result)
        var nodeBuffer = toBuffer(event.target.result);
        var file = fs.openSync('/Users/lelandmiller/test.png', 'w');
        fs.writeSync(file, nodeBuffer, 0, nodeBuffer.length, 0);
    }; // data url!
*/
// https://developer.mozilla.org/en-US/docs/Web/API/Blob
//var reader = new FileReader();
reader.addEventListener("loadend", function() {
        console.log("read: " + reader.result);
        var nodeBuffer = toBuffer(reader.result);
        var file = fs.openSync('/Users/lelandmiller/test.png', 'w');
        fs.writeSync(file, nodeBuffer, 0, nodeBuffer.length, 0);
});
reader.readAsArrayBuffer(blob);
}





var myWikiCore = (function() {
    var my = {},
        rootDir = '',
        currentEntry = null,
        fileTree = null;

    my.createSiblingNode = function(fileElement) {
        var title = prompt('Node Title', 'New Node'),
            fullPath = '';
        if (!title) return;
        fullPath = path.join(fileElement.path, title + '.md');
        if (fs.existsSync(fullPath)) {
            alert('Node already exists.');
        } else {
            if (fs.existsSync(fileElement.path) && fs.statSync(fileElement.path).isDirectory()) {
                fs.writeFileSync(fullPath, '');
            } else {
                alert('Error creating node.');
            }
        }

    };

    my.createChildNode = function(fileElement) {
        var title = prompt('Node Title', 'New Node'),
            newPath = path.join(fileElement.path, fileElement.title);
        filePath = path.join(newPath, title + '.md');

        if (!title || fs.existsSync(filePath)) return;
        // Check if directory exists
        if (fs.existsSync(newPath)) {
            if (fs.statSync(newPath).isDirectory()) {
                fs.writeFileSync(filePath, '');
            } else {
                // Error required folder name taken
                alert('Cannot create required folder, file exists with name.');
            }
        } else {
            if (fs.existsSync(fileElement.path) &&
                fs.statSync(fileElement.path).isDirectory()) {
                // Safe to build new dir
                fs.mkdirSync(newPath);
                fs.writeFileSync(filePath, '');
            } else {
                alert('Error creating child node.');
            }
        }
    };

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
            var newEntry = makeEntryObject(path.join(currPath, files[i]));
            if (!newEntry) continue;
            var existing = underscore.findWhere(ret, {
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



    my.getFileTree = function() {
        return fileTree;
    };

    my.loadProject = function(projectPath) {
        rootDir = projectPath;
        fileTree = buildFileTree(rootDir);
    };
    my.buildFileTree = function() {
        return buildFileTree(rootDir);
    };


    return my;
})();
