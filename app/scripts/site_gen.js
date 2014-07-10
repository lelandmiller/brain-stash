var shjs = require('shelljs');
var path = require('path');
var fs = require('fs');

var siteGenDir = '_site_gen';

function mkdirIfNone(path) {
    if (fs.existsSync(path)) return;
    fs.mkdirSync(path);
}

function generateBrainStashSite() {
    var destPath = prompt('Build destination', '/Users/lelandmiller/BrainStashSite');
    if (!destPath) return;
    mkdirIfNone(destPath);

    var tree = myWikiCore.getFileTree();
    if (tree.length === 0) {
        alert('Project is empty, cannot build site');
        return;
    }
    var rootPath = tree[0].path;

    var template = '{{content}}';
    if (fs.existsSync(path.join(rootPath, siteGenDir, 'default.html'))) {
        template = fs.readFileSync(path.join(rootPath, siteGenDir, 'default.html'), 'utf8');
    }
    template = template.replace(/{{\s*nav\s*}}/, makeTreeList(tree, rootPath));
    shjs.cp('-r', path.join(rootPath, siteGenDir, 'assets', '*'), destPath);

    walkNoteTree(tree, template, rootPath, destPath);
}

function walkNoteTree(nodeArray, template, oldRoot, newRoot) {
    nodeArray.forEach(function(val) {
        var relativePath = path.relative(oldRoot, val.path);
        var newPath = path.join(newRoot, relativePath);

        if (fs.existsSync(path.join(val.path, val.title + '.md'))) {
            var content = fs.readFileSync(path.join(val.path, val.title + '.md'), 'utf8');
            if (content.trim !== '') {
                markdown.convert(content, function(err, newcontent) {
                    fs.writeFileSync(path.join(newPath, val.title + '.html'),
                        template.replace(/{{\s*content\s*}}/, newcontent));
                });
            }
        }
        if (val.children) {
            mkdirIfNone(path.join(newPath, val.title));
            walkNoteTree(val.children, template, oldRoot, newRoot);
        }
    });
}

function makeTreeList(nodeArray, rootPath) {
    var ret = '<ul>';
    nodeArray.forEach(function(val) {
        ret += '<li>';
        var mypath = path.join(val.path, val.title + '.md');
        var mypathhtml = path.join(val.path, val.title + '.html');
        if (fs.existsSync(mypath) && fs.readFileSync(mypath, 'utf8').trim() !== '') {
            ret += '<a href="/' + path.relative(rootPath, mypathhtml) + '">';
            ret += val.title + '</a>';
        } else {
            ret += val.title;
        }
        if (val.children) {
            ret += makeTreeList(val.children, rootPath);
        }
        ret += '</li>';
    });
    return ret + '</ul>';
}
