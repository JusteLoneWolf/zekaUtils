const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

module.exports = function (val) {
  const type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  }
  throw new Error(
      "Ce n'est pas une valeur valide" +
      JSON.stringify(val)
  );
};

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secondes?|seconde?|secs?|s|minutes?|mins?|m|hours?|heures?|heure?|hrs?|h|days?|jour?|jours?|d|weeks?|semaine?|semaines?|sem?|w|years?|ans?|an?|yrs?|y)?$/i.exec(
      str,
  );
  if (!match) {
    return;
  }
  const n = parseFloat(match[1]);
  const type = ( match[2] || 'ms' ).toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'ans':
    case 'yrs':
    case 'an':
    case 'yr':
    case 'y':
    case 'a':
      return n * y;
    case 'semaines':
    case 'semaine':
    case 'weeks':
    case 'week':
    case 'sem':
    case 'w':

      return n * w;
    case 'jours':
    case 'days':
    case 'jour':
    case 'day':
    case 'd':
    case 'j':

      return n * d;
    case 'heures':
    case 'hours':
    case 'heure':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'secondes':
    case 'seconds':
    case 'seconde':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'millisecondes':
    case 'milliseconds':
    case 'milliseconde':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}
