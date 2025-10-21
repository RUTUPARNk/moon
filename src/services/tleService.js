// tleService.js
// Simple TLE fetcher + parser. Uses Celestrak endpoints.
export async function fetchTLEs(dataset = 'stations') {
  // dataset examples: 'stations', 'starlink', 'visual', 'active'
  const url = `https://celestrak.com/NORAD/elements/${dataset}.txt`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch TLEs');
  const text = await res.text();
  return parseTLEText(text);
}

function parseTLEText(tleText) {
  // TLE files often are in blocks: name, line1, line2
  const lines = tleText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const sats = [];
  for (let i = 0; i + 2 <= lines.length; i += 3) {
    const name = lines[i];
    const line1 = lines[i+1];
    const line2 = lines[i+2];
    if (line1 && line2 && line1.startsWith('1') && line2.startsWith('2')) {
      sats.push({ name, line1, line2 });
    } else {
      // fallback: some feeds omit names; try shifting
      // ignore malformed blocks
    }
  }
  return sats;
}
