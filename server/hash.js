const { createHash } = require('crypto');

function sha(str) {
  return createHash('sha1').update(str).digest('hex');
}

module.exports = { sha };
