// ---------------------------------------------------------------------------
// Pure logic (unchanged from web version)
// ---------------------------------------------------------------------------

export function calculate(type, a, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) return null;
  if (type === 'whatIs') return (numA / 100) * numB;
  if (type === 'whatPercent') return numB === 0 ? null : (numA / numB) * 100;
  if (type === 'change')
    return numA === 0 ? null : ((numB - numA) / Math.abs(numA)) * 100;
  return null;
}

export function formatResult(val) {
  if (val === null) return '\u2014';
  const rounded = Math.round(val * 1e10) / 1e10;
  if (Number.isInteger(rounded)) return rounded.toLocaleString();
  return parseFloat(rounded.toFixed(6)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}
