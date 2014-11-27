var Transform = require('stream').Transform,
    util = require('util');

util.inherits(Monoxylon, Transform);

function Monoxylon(options) {
    if (!(this instanceof Monoxylon))
        return new Monoxylon(options);

    Transform.call(this, options);
    this.buf = '';
}

Monoxylon.prototype._transform = function(chunk, encoding, callback) {
    var monox = this;
    pieces = (this.buf + chunk).split('\n');
    pieces.forEach(function(piece, i) {
        if(i === pieces.length-1) {
            this.buf = piece;
            callback();
        }
        else {  
            var subpieces = pieces.split(',');
            monox.push(JSON.stringify({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [subpieces[0], subpieces[1]]
                },
                properties: {}
            }));
        }
    });
}

var mx = new Monoxylon();
process.stdin.pipe(mx).pipe(process.stdout);