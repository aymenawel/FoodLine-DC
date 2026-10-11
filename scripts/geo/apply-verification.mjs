// Applies the October 2026 re-verification (research/notes/verification/*.json) to the food directory.
// Policy (accuracy over count — residents act on these answers):
//   confirmed / updated  -> stays in the core list with the corrections applied
//   closed               -> removed from the core list (kept in extended with a note)
//   unverifiable         -> moved to the extended list, flagged for a phone check
//   promote: true        -> an extended entry moves into the core list
//   new_resources        -> added to the core list if they are east of the river
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import * as turf from '@turf/turf';
import { NOTES, wardOf, isEastOfficial } from './lib.mjs';

const ROOT = path.resolve(NOTES, '../../..');
const VER = path.join(ROOT, 'research/notes/verification');
const CORE = path.join(ROOT, 'data/resources.json');
const EXT = path.join(ROOT, 'data/resources-extended.json');
const TODAY = '2026-10-11';
const FIELDS = new Set(['name', 'type', 'address', 'zip', 'neighborhood', 'lat', 'lng', 'hours', 'schedule_note', 'season', 'free', 'snap', 'wic',
  'produce_plus', 'eligibility', 'languages', 'phone', 'website', 'source_url', 'extra_source_urls', 'confidence', 'notes']);

const core = JSON.parse(readFileSync(CORE, 'utf8'));
const ext = JSON.parse(readFileSync(EXT, 'utf8'));
const byId = (list) => new Map(list.resources.map((r) => [r.id, r]));
const log = { updated: [], confirmed: [], removed_closed: [], moved_unverifiable: [], promoted: [], added: [], skipped_new: [] };

function locate(r) {
  const pt = turf.point([r.lng, r.lat]);
  r.ward = wardOf(pt);
  r.east_of_river = isEastOfficial(pt);
}
function apply(r, e) {
  for (const [k, v] of Object.entries(e.changes ?? {})) if (FIELDS.has(k)) r[k] = v;
  r.confidence = e.confidence ?? r.confidence;
  r.last_verified = TODAY;
  r.extra_source_urls = [...new Set([...(r.extra_source_urls ?? []), ...(e.sources ?? [])])].filter((u) => u !== r.source_url);
  if (e.evidence) r.notes = `${r.notes ? r.notes + ' ' : ''}[Re-checked ${TODAY}] ${e.evidence}`.trim();
  if (e.changes && ('lat' in e.changes || 'lng' in e.changes)) locate(r);
}

const files = readdirSync(VER).filter((f) => f.endsWith('.json') && f !== 'APPLIED.json');
for (const f of files) {
  const v = JSON.parse(readFileSync(path.join(VER, f), 'utf8'));
  for (const e of v.entries ?? []) {
    const c = byId(core).get(e.id), x = byId(ext).get(e.id);
    if (c) {
      apply(c, e);
      if (e.verdict === 'closed') {
        core.resources = core.resources.filter((r) => r.id !== e.id);
        ext.resources.push({ ...c, notes: `${c.notes} CLOSED or season ended per ${TODAY} check.` });
        log.removed_closed.push(e.id);
      } else if (e.verdict === 'unverifiable' || e.confidence === 'low') {
        core.resources = core.resources.filter((r) => r.id !== e.id);
        ext.resources.push({ ...c, notes: `${c.notes} Could not confirm online on ${TODAY}; needs a phone check before it is shown.` });
        log.moved_unverifiable.push(e.id);
      } else (e.verdict === 'updated' ? log.updated : log.confirmed).push(e.id);
    } else if (x && e.promote && e.verdict !== 'closed' && e.verdict !== 'unverifiable' && e.confidence !== 'low') {
      apply(x, e);
      ext.resources = ext.resources.filter((r) => r.id !== e.id);
      core.resources.push(x);
      log.promoted.push(e.id);
    } else if (x) {
      apply(x, e);
    }
  }
  for (const n of v.new_resources ?? []) {
    if (!n.id || !n.name || typeof n.lat !== 'number' || typeof n.lng !== 'number' || byId(core).has(n.id)) { log.skipped_new.push(n.id ?? n.name); continue; }
    const r = { ...n, last_verified: TODAY };
    locate(r);
    if (!r.east_of_river || r.confidence === 'low') { log.skipped_new.push(`${n.id} (not east of river or low confidence)`); continue; }
    core.resources.push(r);
    log.added.push(n.id);
  }
}

const stamp = (o, note) => ({ ...o, generated_at: new Date().toISOString(), note, count: o.resources.length });
writeFileSync(CORE, JSON.stringify(stamp(core, core.note + ` Re-verified ${TODAY}.`.replace(/( Re-verified [\d-]+\.)+/, ` Re-verified ${TODAY}.`)), null, 2));
writeFileSync(EXT, JSON.stringify(stamp(ext, ext.note), null, 2));
writeFileSync(path.join(VER, 'APPLIED.json'), JSON.stringify({ applied: new Date().toISOString(), ...log }, null, 2));
const tally = core.resources.reduce((m, r) => ((m[r.type] = (m[r.type] || 0) + 1), m), {});
console.log('core', core.resources.length, tally);
console.log(JSON.stringify(log, null, 1));
