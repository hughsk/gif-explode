const gif = require('..');
const fs = require('fs');

let i = 0;
fs.createReadStream('homer.gif').pipe(gif(function(frame) {
	frame.pipe(fs.createWriteStream(
		`frame-${i++}.gif`
	));
}));