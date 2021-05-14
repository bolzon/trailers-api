const { URL } = require('url');

const RE_PATHNAME = /^\/pc-se\/film\//i;
const RE_ORIGIN = /^https\:\/\/content\.viaplay\.se/i;

function validateViaplayUrl(viaplayUrl) {
  const url = new URL(viaplayUrl);
  return RE_ORIGIN.test(url.origin) && RE_PATHNAME.test(url.pathname);
}

module.exports = { validateViaplayUrl };
