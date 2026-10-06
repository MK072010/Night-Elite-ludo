// Pure Ludo rules (2-4 seats). Used by the browser (demo bot) and by api/game/act.js (the authoritative server).
// Token progress p: -1 = in yard, 0 = on own start square, 1..50 = along the loop, 51..55 = home column, 56 = home.
export const START = [0, 13, 26, 39], SAFE = new Set([0, 13, 26, 39, 8, 21, 34, 47]), END = 56;
const T = '6,1 6,2 6,3 6,4 6,5 5,6 4,6 3,6 2,6 1,6 0,6 0,7 0,8 1,8 2,8 3,8 4,8 5,8 6,9 6,10 6,11 6,12 6,13 6,14 7,14 8,14 8,13 8,12 8,11 8,10 8,9 9,8 10,8 11,8 12,8 13,8 14,8 14,7 14,6 13,6 12,6 11,6 10,6 9,6 8,5 8,4 8,3 8,2 8,1 8,0 7,0 6,0';
export const TRACK = T.split(' ').map(s => s.split(',').map(Number)); // [row, col]
const rot = ([r, c], n) => { for (let i = 0; i < n; i++) [r, c] = [c, 14 - r]; return [r, c]; };
const rotC = ([R, C], n) => { for (let i = 0; i < n; i++) [R, C] = [C, 15 - R]; return [R, C]; };
const YARD = [[2, 2], [2, 4], [4, 2], [4, 4]];
export const cellRC = (q, p) => p <= 50 ? TRACK[(START[q] + p) % 52] : rot([7, p - 50], q);
export const xy = (q, p, i) => { const [R, C] = p < 0 ? rotC(YARD[i], q) : cellRC(q, p).map(v => v + .5); return [C, R]; }; // board units (x=col, y=row)
export const seatOf = (s, id) => s.seats[s.ids.indexOf(id)];
export function newGame(ids, seats = [0, 2]) { const tok = {}; seats.forEach(q => tok[q] = [-1, -1, -1, -1]); return { ids, seats, tok, turn: 0, phase: 'roll', dice: 0, sixes: 0, winner: null, last: null }; }
export function legal(s) { if (s.phase !== 'move') return []; const d = s.dice; return s.tok[s.seats[s.turn]].map((p, i) => (p < 0 ? d === 6 : p + d <= END) ? i : -1).filter(i => i >= 0); }
const pass = s => { s.turn = (s.turn + 1) % s.seats.length; s.phase = 'roll'; s.sixes = 0; };
export function roll(s0, d) {
  if (s0.winner != null || s0.phase !== 'roll') throw Error('NOT_ROLL');
  const s = structuredClone(s0); s.dice = d; s.last = { seat: s.seats[s.turn], roll: d };
  if (d === 6 && ++s.sixes === 3) { pass(s); return s; } // three sixes in a row: turn is lost
  s.phase = 'move'; const l = legal(s);
  if (!l.length) { pass(s); return s; }
  return l.length === 1 ? move(s, l[0]) : s;
}
export function move(s0, ti) {
  if (s0.winner != null || s0.phase !== 'move') throw Error('NOT_MOVE');
  if (!legal(s0).includes(ti)) throw Error('ILLEGAL');
  const s = structuredClone(s0), q = s.seats[s.turn], d = s.dice, t = s.tok[q], np = t[ti] < 0 ? 0 : t[ti] + d; let cap = 0;
  t[ti] = np;
  if (np <= 50) { const c = (START[q] + np) % 52; if (!SAFE.has(c)) s.seats.forEach(o => { if (o !== q) s.tok[o].forEach((p, j) => { if (p >= 0 && p <= 50 && (START[o] + p) % 52 === c) { s.tok[o][j] = -1; cap++; } }); }); }
  s.last = { seat: q, roll: d, tok: ti, cap, to: np };
  if (t.every(p => p === END)) { s.winner = q; return s; }
  if (d === 6 || cap || np === END) { s.phase = 'roll'; if (d !== 6) s.sixes = 0; } else pass(s); // 6, capture or reaching home = roll again
  return s;
}
export function botPick(s) { const q = s.seats[s.turn]; let best = -1, bs = -1; for (const i of legal(s)) { const r = move(s, i); const sc = (r.last.cap ? 100 : 0) + (r.last.to === END ? 50 : 0) + (s.tok[q][i] < 0 ? 30 : 0) + r.last.to; if (sc > bs) { bs = sc; best = i; } } return best; }
