// # markdown.js

// Contains logic for markdown conversion, exports convert, which takes the
// markdown and converts it to HTML.


var marked = require('marked');
var graphviz = require('graphviz');
var process = require('child_process');

var renderer = new marked.Renderer();

var oldCodeRenderer = renderer.code;

// This renderer only outputs the pre and code tags if it is not a processed
// language.
renderer.code = function(code, lang) {
    console.log('lang: ' + lang);
    console.log('code: ' + code);

    if (lang === 'dot*') {
        //return '<em>Dot Graph Here</em>';
        return code;
    } else {
        return oldCodeRenderer.call(this, code, lang);
    }
};
// TODO: maintain dot process pool
function dot(code, callback) {
    var proc = process.spawn('/usr/local/bin/dot', ['-Tsvg']);
    console.log('in dot:' + code);
    var out = '';
    var err = '';

    proc.stdout.on('data', function(data) {
        out += data;
    });

    proc.stderr.on('data', function(data) {
        err += data;
    });

    proc.on('close', function(code) {
        err = err || null;
        callback(null, out);
        console.log('out: ' + out);
        console.log('err: ' + err);
        console.log('child process exited with code ' + code);
    });

    proc.stdin.write(code + '\n');
    proc.stdin.end();
}

function highlight(code, lang, callback) {
    if (lang === 'dot*') {
        dot(code, callback);
        console.log('in highlight');
    } else {
        callback(null, code);
    }
}

// Convert markdown to html
// callback (err, content)
exports.convert = function(markdownString, callback) {
    marked(markdownString, {
        renderer: renderer,
        highlight: highlight
    }, callback);
};
