import _ from 'lodash';

// Split a List or Dictionary value from a contribution file into its items.
// Items are separated by the delimiter (a colon by default), except where the
// delimiter is inside double quotes ("A: B") or square brackets (Title[https://...]).
// Surrounding quotes are removed from each item and empty items are dropped.
export function splitDelimited(value, delimiter = ':') {
  if (value === undefined || value === null) return [];
  if (_.isArray(value)) return _.compact(value.map(x => _.trim(_.trim(`${x}`), '"').trim()));
  let items = [], item = '', inQuotes = false, depth = 0;
  for (let c of `${value}`) {
    if (c === '"') inQuotes = !inQuotes;
    else if (c === '[' && !inQuotes) depth++;
    else if (c === ']' && !inQuotes && depth > 0) depth--;
    if (c === delimiter && !inQuotes && depth === 0) {
      items.push(item);
      item = '';
    } else {
      item += c;
    }
  }
  items.push(item);
  return _.compact(items.map(x => _.trim(_.trim(x), '"').trim()));
}
