#!/usr/bin/env node
// Refreshes `lastUpdated` in projects/*.json from the real world:
//   - Firebase Hosting answers HEAD requests with a Last-Modified header equal to
//     the time of the latest deploy, so any project with a `link` on a hosted
//     site gets its deploy date.
//   - GitHub links use the public API's `pushed_at`.
// Only moves dates forward; never earlier than what is already recorded.
//
//   node tools/refresh-dates.js          # update files
//   node tools/refresh-dates.js --dry    # show what would change

const fs = require('fs');
const path = require('path');
const https = require('https');

const DIR = path.join(__dirname, '..', 'projects');
const dry = process.argv.includes('--dry');

function head(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'luarai-refresh-dates' } }, (res) => {
      resolve(res.headers['last-modified'] || null);
      res.resume();
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function githubPushed(repoUrl) {
  const m = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return Promise.resolve(null);
  const api = `https://api.github.com/repos/${m[1]}/${m[2].replace(/\.git$/, '')}`;
  return new Promise((resolve) => {
    https.get(api, { headers: { 'User-Agent': 'luarai-refresh-dates' } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body).pushed_at || null); } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

const iso = (d) => new Date(d).toISOString().slice(0, 10);

(async () => {
  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
    const fp = path.join(DIR, file);
    const p = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (!p.link) continue;
    const raw = p.link.includes('github.com') ? await githubPushed(p.link) : await head(p.link);
    if (!raw) { console.log(`${p.title.padEnd(20)} no date from ${p.link}`); continue; }
    const fresh = iso(raw);
    const current = p.lastUpdated || p.date;
    if (fresh > current) {
      console.log(`${p.title.padEnd(20)} ${current} -> ${fresh}`);
      if (!dry) { p.lastUpdated = fresh; fs.writeFileSync(fp, JSON.stringify(p, null, 2) + '\n'); }
    } else {
      console.log(`${p.title.padEnd(20)} ${current} (deploy ${fresh}, unchanged)`);
    }
  }
})();
