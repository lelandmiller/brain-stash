// Contains code for interfacing with the clipboard

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


