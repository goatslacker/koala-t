var fs = require('fs');
var file = 'koala.json';
var options;

// Loads options from `koala.json` if that file exists
// in the project's root directory.
try {
  options = JSON.parse(fs.readFileSync(file, 'utf-8'));
} catch (err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }

  options = {};
}

// export to koala
module.exports = options;
