// SPDX-License-Identifier: MIT
// Nerava: an original river-canton passport, generated without network access.
// Run with Node 22.18+; the native renderer and all fonts are vendored.
const fs = require('node:fs');
const path = require('node:path');
const nodeCrypto = require('node:crypto');
const { Resvg } = require('./node_modules/@resvg/resvg-js');

const ROOT = __dirname;
const W = 1024;
const H = 768;
const C = {
  ink: '#253f3d', wine: '#71363c', muted: '#6f7465', paper: '#f4f0df',
  ochre: '#a79a6c', blue: '#385a77', green: '#39735b', rule: '#8d9a87',
};
const ID = {
  country: 'NERAVA', code: 'NRV', document: 'NR0483162',
  surname: 'DRAVIK', names: 'MARA IVA', nationality: 'NERAVAN',
  birth: '980216', birthLabel: '16 FEB 1998', sex: 'F',
  issued: '2023-03-12', issueLabel: '12 MAR 2023',
  expires: '330311', expiryLabel: '11 MAR 2033',
  birthplace: 'DOLEN, LOWER REACH', authority: 'CANTON REGISTRY, DOLEN',
  occupation: 'LOCKKEEPER', licence: 'LK-0416', personal: '0600416',
};
const HISTORY = [
  { country: 'NERAVA', action: 'DEPARTURE', local: 'ODHOD', date: '2024-04-17', label: '17 APR 2024', post: 'DOLEN LOCK 04', ink: C.wine, angle: -3 },
  { country: 'VEDRIN', action: 'ARRIVAL', local: 'PRIHOD', date: '2024-04-17', label: '17 APR 2024', post: 'VARN GATE 04', ink: C.blue, angle: 2 },
  { country: 'VEDRIN', action: 'DEPARTURE', local: 'ODHOD', date: '2024-04-29', label: '29 APR 2024', post: 'VARN GATE 04', ink: C.blue, angle: -1 },
  { country: 'NERAVA', action: 'ARRIVAL', local: 'PRIHOD', date: '2024-04-29', label: '29 APR 2024', post: 'DOLEN LOCK 04', ink: C.wine, angle: 3 },
  { country: 'NERAVA', action: 'DEPARTURE', local: 'ODHOD', date: '2025-10-06', label: '06 OCT 2025', post: 'SAVA RIVER POST', ink: C.wine, angle: 2 },
  { country: 'ORSEN', action: 'ARRIVAL', local: 'PRIHOD', date: '2025-10-06', label: '06 OCT 2025', post: 'BRIN RIVER POST', ink: C.green, angle: -3 },
  { country: 'ORSEN', action: 'DEPARTURE', local: 'ODHOD', date: '2025-10-18', label: '18 OCT 2025', post: 'BRIN RIVER POST', ink: C.green, angle: 2 },
  { country: 'NERAVA', action: 'ARRIVAL', local: 'PRIHOD', date: '2025-10-18', label: '18 OCT 2025', post: 'SAVA RIVER POST', ink: C.wine, angle: -2 },
];

type TextOptions = { fill?: string; family?: string; weight?: number; anchor?: string; spacing?: number; italic?: boolean; opacity?: number };
type Crossing = typeof HISTORY[number];

function esc(value: string | number) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
function text(x: number, y: number, value: string | number, size = 12, opts: TextOptions = {}) {
  const { fill = C.ink, family = 'Lato', weight = 400, anchor = 'start', spacing = 0, italic = false, opacity = 1 } = opts;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${spacing}" font-style="${italic ? 'italic' : 'normal'}" fill="${fill}" opacity="${opacity}">${esc(value)}</text>`;
}
function line(x1: number, y1: number, x2: number, y2: number, color = C.rule, width = .6, extra = '') {
  return `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
}
function rect(x: number, y: number, w: number, h: number, fill = 'none', stroke = C.rule, sw = .65, radius = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function pointsPath(points: number[][], close = false) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('') + (close ? 'Z' : '');
}
function rosette(cx: number, cy: number, radius: number, color: string, opacity = .18) {
  let out = `<g fill="none" stroke="${color}" stroke-width=".38" opacity="${opacity}">`;
  for (let k = 0; k < 11; k++) {
    const pts = [];
    for (let j = 0; j <= 720; j++) {
      const a = j * Math.PI / 180;
      const r = radius + 4.7 * Math.sin(17 * a + k * .22) + k * .48;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    out += `<path d="${pointsPath(pts)}"/>`;
  }
  return out + '</g>';
}
function emblem(cx: number, cy: number, scale = 1, color = C.wine, opacity = 1) {
  // The gate, three navigable reaches and nine rivets are Nerava's own seal.
  let out = `<g transform="translate(${cx} ${cy}) scale(${scale})" fill="none" stroke="${color}" stroke-linejoin="round" opacity="${opacity}">`;
  out += '<circle r="25" stroke-width="1.1"/><circle r="22" stroke-width=".45"/>';
  out += '<path d="M-12 8V-8Q0-24 12-8V8M-8 6V-8Q0-18 8-8V6M-14 9H14M0-13V6" stroke-width="1.4"/>';
  for (let i = 0; i < 3; i++) out += `<path d="M-14 ${12 + i * 3}Q-7 ${8 + i * 3} 0 ${12 + i * 3}T14 ${12 + i * 3}" stroke-width=".9"/>`;
  for (let i = 0; i < 9; i++) {
    const a = (200 + i * 17.5) * Math.PI / 180;
    out += `<circle cx="${(19.3 * Math.cos(a)).toFixed(2)}" cy="${(19.3 * Math.sin(a)).toFixed(2)}" r=".7" fill="${color}" stroke="none"/>`;
  }
  return out + '</g>';
}
function field(x: number, y: number, label: string, value: string, size = 15.6, width = 270) {
  return text(x, y, label, 8.1, { fill: C.muted, spacing: .35 }) +
    text(x, y + 18, value, size, { weight: 700, spacing: .12 }) +
    line(x, y + 25, x + width, y + 25, '#acb4a0', .45);
}
function digit(value: string) {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    const n = c === '<' ? 0 : /[0-9]/.test(c) ? Number(c) : c.charCodeAt(0) - 55;
    sum += n * weights[i % 3];
  }
  return String(sum % 10);
}
function mrz() {
  const name = `${ID.surname}<<${ID.names.replaceAll(' ', '<')}`;
  const first = (`P<${ID.code}${name}`).padEnd(44, '<').slice(0, 44);
  const optional = ID.personal.padEnd(14, '<');
  const a = ID.document + digit(ID.document);
  const b = ID.birth + digit(ID.birth);
  const c = ID.expires + digit(ID.expires);
  const d = optional + digit(optional);
  const second = a + ID.code + b + ID.sex + c + d + digit(a + b + c + d);
  if (first.length !== 44 || second.length !== 44) throw new Error('Invalid TD3 line length');
  return [first, second];
}
function underprint() {
  let out = '<g clip-path="url(#paperClip)">';
  for (let page = 0; page < 2; page++) {
    const left = page ? 519 : 23;
    for (let row = 0; row < 76; row++) {
      const pts = [];
      for (let i = 0; i <= 120; i++) {
        const x = left + i * 4;
        const y = 22 + row * 9.55 + 2.7 * Math.sin(i * .155 + row * .17) + 1.2 * Math.sin(i * .37 - row * .11);
        pts.push([x, y]);
      }
      out += `<path d="${pointsPath(pts)}" fill="none" stroke="${row % 4 === 0 ? '#b4bca5' : '#d1c8a7'}" stroke-width=".42" opacity=".37"/>`;
    }
  }
  out += rosette(433, 500, 66, '#768d83', .16);
  out += rosette(749, 418, 130, '#b2a375', .12);
  // Connected river-canton watermark, drawn from scratch, not a geographic source.
  out += '<g transform="translate(286 465)" stroke="#97aa96" fill="none" opacity=".21">';
  const river = [[42,-75],[20,-52],[32,-24],[5,2],[25,32],[10,53],[27,77],[15,107],[28,134]];
  out += `<path d="${pointsPath(river)}" stroke-width="7" opacity=".4"/><path d="${pointsPath(river)}" stroke-width=".6"/>`;
  out += '<path d="M20-52L-23-64L-52-42L-48-12L5 2M32-24L74-34L94-1L25 32M10 53L-31 51L-52 80L27 77M15 107L70 97L87 125L28 134" stroke-width=".7"/>';
  for (const [x,y] of river.filter((_,i) => i % 2 === 0)) out += `<circle cx="${x}" cy="${y}" r="3.3" stroke-width=".7"/>`;
  out += '</g>';
  return out + '</g>';
}
function stamp(item: Crossing, x: number, y: number, index: number) {
  const w = 194, h = 76;
  let out = `<g transform="translate(${x} ${y}) rotate(${item.angle} ${w / 2} ${h / 2})" opacity=".87">`;
  if (item.country === 'ORSEN') {
    out += `<path d="M9 0H185L194 9V67L185 76H9L0 67V9Z" fill="none" stroke="${item.ink}" stroke-width="1.8"/>`;
    out += `<path d="M11 4H183L190 11V65L183 72H11L4 65V11Z" fill="none" stroke="${item.ink}" stroke-width=".55"/>`;
  } else {
    out += rect(0, 0, w, h, 'none', item.ink, 1.8, item.country === 'VEDRIN' ? 9 : 2);
    out += rect(3.4, 3.4, w - 6.8, h - 6.8, 'none', item.ink, .5, item.country === 'VEDRIN' ? 6 : 0);
  }
  out += text(97, 19, item.country, 13.6, { fill: item.ink, weight: 700, anchor: 'middle', spacing: 1.4 });
  out += line(12, 25, 182, 25, item.ink, .5);
  out += text(97, 38, `${item.local} / ${item.action}`, 8.3, { fill: item.ink, anchor: 'middle', spacing: .7 });
  out += text(97, 55, item.label, 15, { fill: item.ink, family: 'IBM Plex Mono', weight: 400, anchor: 'middle', spacing: .4 });
  out += text(97, 68, item.post, 8.2, { fill: item.ink, anchor: 'middle', spacing: .75 });
  const dir = item.action === 'ARRIVAL' ? 1 : -1;
  out += `<path d="M${17 - dir * 4} 46h${dir * 9}l${-dir * 3} -3m${dir * 3} 3l${-dir * 3} 3" fill="none" stroke="${item.ink}" stroke-width=".9"/>`;
  out += text(179, 55, String(index + 1).padStart(2, '0'), 6.7, { fill: item.ink, anchor: 'middle' });
  // Short white breaks, confined to the outer ink, suggest repeated stamp use.
  out += `<path d="M42 0h3M147 76h2M194 23v2" stroke="${C.paper}" stroke-width="1.4"/>`;
  return out + '</g>';
}
function signature(x: number, y: number) {
  return `<g transform="translate(${x} ${y})" fill="none" stroke="${C.blue}" stroke-width="1.05" stroke-linecap="round"><path d="M0 4Q5-17 8 2L14-6L13 5Q18-7 20 3Q24-6 25 5Q30-2 33 4M37 3Q40-14 44-13Q49-10 41 6Q51-4 53 2Q56 6 61-4M68 5L72-11Q77-18 80-12Q85-2 72 3Q79-1 84 6Q91 10 95-4Q99-10 103-3Q98 7 94 4Q105-7 111 1Q112 7 116 3L123-6Q119 6 124 5L132-7M0 10Q63 8 138 12"/></g>`;
}
function validateHistory(history: Crossing[]) {
  let latest = ID.issued;
  let currentCountry = ID.country;
  let between = false;
  for (const crossing of history) {
    if (crossing.date < ID.issued || crossing.date < latest || crossing.date > '2033-03-11') {
      throw new Error('Travel chronology is outside the issue/expiry interval or out of order');
    }
    if (crossing.action === 'DEPARTURE') {
      if (between || crossing.country !== currentCountry) throw new Error('Departure does not match current border state');
      between = true;
    } else if (crossing.action === 'ARRIVAL') {
      if (!between || crossing.country === currentCountry) throw new Error('Arrival has no matching departure');
      currentCountry = crossing.country;
      between = false;
    } else throw new Error('Unknown border action');
    latest = crossing.date;
  }
  if (between || currentCountry !== ID.country) throw new Error('Travel record does not end with a home arrival');
  return true;
}
function buildSvg() {
  validateHistory(HISTORY);
  const photo = fs.readFileSync(path.join(ROOT, 'assets/synthetic-portrait.jpg')).toString('base64');
  const photoUri = `data:image/jpeg;base64,${photo}`;
  const [m1, m2] = mrz();
  let s = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<defs>
    <linearGradient id="stock" x2="0" y2="1"><stop stop-color="#f7f3e7"/><stop offset=".52" stop-color="#f1eddc"/><stop offset="1" stop-color="#f7f2e4"/></linearGradient>
    <linearGradient id="fold"><stop stop-color="#635a45" stop-opacity="0"/><stop offset=".43" stop-color="#655d4b" stop-opacity=".14"/><stop offset=".5" stop-color="#34372c" stop-opacity=".5"/><stop offset=".57" stop-color="#fffdf0" stop-opacity=".7"/><stop offset="1" stop-color="#fffdf0" stop-opacity="0"/></linearGradient>
    <linearGradient id="photoWash" x2="0" y2="1"><stop stop-color="#d5d8cb" stop-opacity=".08"/><stop offset="1" stop-color="#46645b" stop-opacity=".19"/></linearGradient>
    <clipPath id="paperClip"><rect x="23" y="22" width="978" height="724" rx="3"/></clipPath>
    <clipPath id="portraitClip"><rect x="42" y="173" width="145" height="188"/></clipPath>
    <clipPath id="headContour"><path transform="translate(42 194) scale(.1416015625 .1630859375)" d="M450 0Q372 8 302 72Q203 157 185 318L156 500L178 678L132 800L0 868V1024H1024V940L909 854L826 795L857 671L884 481L865 285Q841 125 760 57L680 0Z"/></clipPath>
    <clipPath id="hairCrown"><ellipse cx="122" cy="194" rx="17" ry="6"/></clipPath>
    <clipPath id="ghostClip"><rect x="422" y="535" width="47" height="59" rx="3"/></clipPath>
    <filter id="ghost"><feColorMatrix type="matrix" values=".19 .38 .10 0 .1 .19 .38 .10 0 .14 .19 .38 .10 0 .08 0 0 0 .2 0"/></filter>
  </defs>`;
  s += rect(0, 0, W, H, '#2c3f3b', 'none');
  s += rect(14, 13, 996, 742, '#4c3635', 'none', 0, 8);
  s += rect(23, 22, 978, 724, 'url(#stock)', 'none', 0, 3);
  s += underprint();
  s += rect(33, 32, 460, 703, 'none', '#9a9f89', .45);
  s += rect(531, 32, 458, 703, 'none', '#9a9f89', .45);
  s += rect(493, 22, 38, 724, 'url(#fold)', 'none');

  // Data-page hierarchy: crest/title, registry row, portrait/fields, endorsement, MRZ.
  s += emblem(69, 69, 1.02);
  s += text(110, 61, 'REPUBLIKA NERAVA', 24, { family: 'PT Serif', weight: 700, fill: C.wine, spacing: .7 });
  s += text(111, 82, 'REPUBLIC OF NERAVA', 11.4, { spacing: 2.3 });
  s += text(42, 115, 'POTNI LIST / PASSPORT', 12, { weight: 700, spacing: 2.25 });
  s += text(478, 114, ID.document, 11, { family: 'IBM Plex Mono', anchor: 'end', fill: C.wine });
  s += line(42, 125, 478, 125, C.wine, 1.15);
  s += text(42, 141, 'TIP / TYPE', 7.7, { fill: C.muted, spacing: .45 });
  s += text(42, 159, 'P', 14, { weight: 700 });
  s += text(104, 141, 'KODA / CODE', 7.7, { fill: C.muted, spacing: .45 });
  s += text(104, 159, ID.code, 14, { weight: 700 });
  s += text(201, 141, 'ŠTEVILKA LISTA / DOCUMENT NUMBER', 7.7, { fill: C.muted, spacing: .3 });
  s += text(201, 159, ID.document, 17, { weight: 700, family: 'IBM Plex Mono', spacing: .65 });

  s += `<g clip-path="url(#portraitClip)">`;
  s += rect(42, 173, 145, 188, '#d0d3cc', 'none');
  s += '<path d="M42 361V343Q49 328 81 322L114 337L147 322Q176 327 187 343V361Z" fill="#35423e"/>';
  s += `<g clip-path="url(#hairCrown)"><image x="42" y="194" width="145" height="167" preserveAspectRatio="none" transform="translate(0 388) scale(1 -1)" xlink:href="${photoUri}"/></g>`;
  s += `<g clip-path="url(#headContour)"><image x="42" y="194" width="145" height="167" preserveAspectRatio="none" xlink:href="${photoUri}"/></g>`;
  s += rect(42, 173, 145, 188, 'url(#photoWash)', 'none');
  // Very light laser-personalization lines retain facial readability.
  for (let y = 175; y < 360; y += 3) s += line(42, y, 187, y, '#f1f0e1', .24, 'opacity=".2"');
  s += '</g>' + rect(42, 173, 145, 188, 'none', '#5d7368', .65);
  s += text(42, 373, 'FOTOGRAFIJA / PHOTOGRAPH', 6.8, { fill: C.muted, spacing: .45 });
  s += field(201, 183, 'PRIIMEK / SURNAME', ID.surname, 19, 277);
  s += field(201, 230, 'IME / GIVEN NAMES', ID.names, 17, 277);
  s += field(201, 277, 'DRŽAVLJANSTVO / NATIONALITY', ID.nationality, 15.6, 277);
  s += field(201, 324, 'DATUM ROJSTVA / DATE OF BIRTH', ID.birthLabel, 14.5, 179);
  s += field(399, 324, 'SPOL / SEX', ID.sex, 14.5, 79);
  s += field(201, 371, 'KRAJ ROJSTVA / PLACE OF BIRTH', ID.birthplace, 13.8, 277);
  s += signature(45, 399);
  s += line(42, 418, 187, 418, C.rule, .5);
  s += text(42, 431, 'PODPIS IMETNICE / HOLDER’S SIGNATURE', 6.7, { fill: C.muted });
  s += field(201, 418, 'IZDANO / DATE OF ISSUE', ID.issueLabel, 13.5, 132);
  s += field(351, 418, 'VELJA DO / DATE OF EXPIRY', ID.expiryLabel, 13.5, 127);
  s += field(42, 468, 'ORGAN / ISSUING AUTHORITY', ID.authority, 13.1, 436);
  s += text(42, 518, 'URADNI ZAZNAMKI / OFFICIAL OBSERVATIONS', 8, { weight: 700, fill: C.wine, spacing: .65 });
  s += text(42, 540, 'Registered lockkeeper · licence LK-0416.', 14, { family: 'PT Serif' });
  s += text(42, 560, 'Night-passage endorsement on page 3.', 13.4, { family: 'PT Serif' });
  s += text(42, 589, 'River canton: Lower Reach · Dolen Registry', 10, { fill: C.muted });
  s += `<g clip-path="url(#ghostClip)" filter="url(#ghost)"><image x="413" y="531" width="65" height="67" xlink:href="${photoUri}"/></g>`;
  s += text(478, 610, ID.personal, 9, { family: 'IBM Plex Mono', fill: '#7e927f', anchor: 'end', spacing: 2 });
  s += line(42, 623, 478, 623, C.rule, .5);
  for (let y = 635; y < 647; y += 5) s += text(42, y, 'NERAVA · NINE CANTONS · ONE RIVER · NERAVA · NINE CANTONS · ONE RIVER ·', 3.65, { fill: '#7d8b78', spacing: .7 });
  s += rect(37, 656, 451, 64, '#f7f3e7', 'none');
  s += text(44, 680, m1, 15.6, { family: 'IBM Plex Mono', fill: '#252d28', spacing: .32 });
  s += text(44, 707, m2, 15.6, { family: 'IBM Plex Mono', fill: '#252d28', spacing: .32 });
  s += text(42, 732, '2', 8.5, { fill: C.muted });
  s += text(478, 732, 'NRV · SERIES 2023', 6.8, { anchor: 'end', fill: C.muted, spacing: 1.1 });

  // The facing leaf is a working record, not a decorative collection of seals.
  s += text(548, 66, 'VIZUMI / VISAS', 23, { family: 'PT Serif', weight: 700, fill: C.wine, spacing: .8 });
  s += text(973, 64, '3', 10, { anchor: 'end', fill: C.muted });
  s += text(548, 88, 'MEJNI PREHODI · BORDER CROSSINGS', 8.3, { spacing: 1.55 });
  s += line(548, 102, 973, 102, C.wine, 1.15);
  s += text(548, 121, 'OFFICIAL STAMPS AND ENDORSEMENTS ONLY', 7.2, { fill: C.muted, spacing: .7 });
  s += text(973, 121, ID.document, 8, { family: 'IBM Plex Mono', anchor: 'end', fill: C.muted });
  for (let i = 0; i < HISTORY.length; i++) {
    const x = i % 2 ? 770 : 549;
    const y = 145 + Math.floor(i / 2) * 94;
    s += stamp(HISTORY[i], x, y, i);
  }
  s += rect(548, 558, 425, 130, '#f6f1df', C.ink, .8);
  s += rect(548, 558, 425, 20, C.ink, 'none');
  s += text(560, 572, 'DIRECTORATE OF RIVER LOCKS · FORM N/04', 8.2, { fill: '#f5f0df', spacing: 1.0, weight: 700 });
  s += text(560, 599, 'NIGHT-PASSAGE ENDORSEMENT', 13.1, { weight: 700, fill: C.wine, spacing: .35 });
  s += text(560, 620, 'Lock 04 · 20:00–05:00 · official lock duty only.', 11.1, { family: 'PT Serif' });
  s += text(560, 638, 'Present lockkeeper’s licence with this passport.', 11.1, { family: 'PT Serif' });
  s += text(560, 658, 'Holder: DRAVIK, MARA IVA · LK-0416', 9.1, { weight: 700 });
  s += text(560, 676, 'Dolen · 12 MAR 2023 · valid until 11 MAR 2033', 9.1, { fill: C.muted });
  s += `<g transform="translate(930 645) rotate(-10)" fill="none" stroke="${C.wine}" opacity=".73"><circle r="29" stroke-width="1.1"/><circle r="26" stroke-width=".45"/>`;
  s += text(0, -9, 'RIVER LOCKS', 6.5, { fill: C.wine, anchor: 'middle', weight: 700, spacing: .4 });
  s += text(0, 4, '04', 17, { fill: C.wine, anchor: 'middle', family: 'PT Serif', weight: 700 });
  s += text(0, 16, 'DOLEN', 6.4, { fill: C.wine, anchor: 'middle', spacing: 1 });
  s += '</g>';
  s += text(548, 712, 'This passport remains the property of the Republic of Nerava.', 9.6, { family: 'PT Serif', italic: true, fill: C.muted });
  s += text(548, 727, 'If found, return to a Neravan canton registry or consular office.', 9.6, { family: 'PT Serif', italic: true, fill: C.muted });
  s += '</svg>';
  return s;
}
function main() {
  process.umask(0o022);
  const out = process.env.OUTPUT_DIR || '/output';
  fs.mkdirSync(out, { recursive: true, mode: 0o755 });
  const fontDir = path.join(ROOT, 'assets/fonts');
  const fontFiles = fs.readdirSync(fontDir).filter((n: string) => n.endsWith('.ttf')).sort().map((n: string) => path.join(fontDir, n));
  const svg = buildSvg();
  const renderer = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Lato' }, fitTo: { mode: 'original' } });
  const png = Buffer.from(renderer.render().asPng());
  if (png.length > 1048576) throw new Error(`Image exceeds size limit: ${png.length}`);
  const file = path.join(out, 'entry.png');
  fs.writeFileSync(file, png, { mode: 0o644 });
  fs.chmodSync(file, 0o644);
  if (process.env.EXPORT_SVG) fs.writeFileSync(process.env.EXPORT_SVG, svg, { mode: 0o644 });
  console.log(JSON.stringify({ artifact: file, width: W, height: H, bytes: png.length, sha256: nodeCrypto.createHash('sha256').update(png).digest('hex') }));
}
if (require.main === module) main();
module.exports = { ID, HISTORY, mrz, digit, buildSvg, validateHistory };
