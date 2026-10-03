/* Cadence — engine.
   Everything runs in the browser: speech recognition, scoring, scheduling,
   persistence. No API, no network, no keys. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const KEY = "cadence.v1";

/* ── state ─────────────────────────────────────────── */

const state = {
  lang: "es-mx",
  scenario: null,
  queue: [],
  idx: 0,
  items: {},      // id -> { score, reps, due, seen }
  log: [],        // { id, score, ts }
  listening: false,
  startedAt: 0,
  lastWords: 0
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    Object.assign(state, JSON.parse(raw), { listening: false });
  } catch { /* first run, or storage blocked — defaults are fine */ }
}
function save() {
  const { items, log, lang } = state;
  try { localStorage.setItem(KEY, JSON.stringify({ items, log: log.slice(-200), lang })); } catch {}
}

const deck = () => DECKS[state.lang];
const sid = (sc, i) => `${state.lang}:${sc.id}:${i}`;
const itemKey = () => sid(state.scenario, state.idx);

function rec(key) {
  return state.items[key] || { score: 0, reps: 0, due: 0, seen: 0 };
}

/* ── text normalisation ────────────────────────────── */

const norm = s =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?¡¿;:"'()¿…]/g, " ")
    .replace(/\s+/g, " ").trim();

const words = s => norm(s).split(" ").filter(Boolean);
const W = t => words(t).length;

/* Longest common subsequence on word tokens.
   Order-insensitive word matches would let "a b" pass as "b a";
   fluent drills care about order, so pay for the alignment. */
function lcs(a, b) {
  const m = a.length, n = b.length;
  if (!m || !n) return { len: 0, hits: new Array(m).fill(null) };
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hits = new Array(m).fill(null);
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { hits[i] = b[j]; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return { len: dp[0][0], hits };
}

/* ── scoring ───────────────────────────────────────── */

const FILLERS = ["um", "uh", "erm", "eh", "ah", "like", "you know", "mhm"];

function score(heardRaw, target) {
  const targetW = words(target);
  const heardW = words(heardRaw);
  const { len, hits } = lcs(targetW, heardW);

  /* accuracy: matched words vs what you actually produced */
  const matched = len;
  const accuracy = heardW.length
    ? Math.min(1, matched / Math.max(matched, heardW.length)) * (matched / targetW.length)
    : 0;

  /* coverage: did you hit every chunk, or just the easy nouns? */
  const coverage = targetW.length ? matched / targetW.length : 0;

  /* fluency: words per minute, and filler density.
     Speaking too fast is as bad as too slow — it hides the pauses
     you haven't trained away yet. */
  const secs = Math.max(0.6, (performance.now() - state.startedAt) / 1000);
  const wpm = heardW.length / (secs / 60);
  const rateFit = heardW.length < 2 ? 0.6 : 1 - Math.min(1, Math.abs(wpm - 105) / 105);
  const fillerCount = heardW.filter(w => FILLERS.includes(w)).length;
  const fillerRate = heardW.length ? fillerCount / heardW.length : 0;
  const fluency = Math.max(0, Math.min(1, rateFit - fillerRate * 2));

  const total = Math.round((accuracy * 0.5 + coverage * 0.3 + fluency * 0.2) * 100);

  return {
    total, accuracy: Math.round(accuracy * 100), coverage: Math.round(coverage * 100),
    fluency: Math.round(fluency * 100), wpm: Math.round(wpm), fillers: fillerCount,
    missed: targetW.filter((w, i) => hits[i] === null),
    heardW, targetW
  };
}

function coach(r, target) {
  const out = [];
  if (!r.heardW.length) out.push("Nothing heard — get within a metre of the mic and try again.");
  else {
    if (r.coverage >= 95) out.push(`Complete: every word in the target landed.`);
    else if (r.missed.length) out.push(`Dropped <b>${r.missed.slice(0, 6).join(" ")}</b> — the chunks that carry the meaning.`);
    if (r.wpm > 150) out.push(`Came out at <b>${r.wpm} wpm</b>, well above conversational. Slow down; speed comes after accuracy.`);
    else if (r.wpm < 70 && r.heardW.length > 3) out.push(`Only <b>${r.wpm} wpm</b>. Hesitation here means the phrase isn't chunked yet — say it 3x without thinking.`);
    if (r.fillers) out.push(`${r.fillers} filler${r.fillers > 1 ? "s" : ""} — in a second language the filler should be in <i>the target</i>, not English.`);
    if (r.coverage >= 80 && r.wpm >= 85 && r.wpm <= 140 && !r.fillers)
      out.push(`Clean. Natural pace, nothing dropped. Say it once more tomorrow.`);
  }
  if (!out.length) out.push("Say it out loud five more times, then come back to it.");
  return out;
}

/* ── SM-2 lite ───────────────────────────────────────
   Everything below 80 is not "learned" and comes back in a day.
   Above that, intervals grow — 1, 3, then roughly doubling. */

function schedule(key, score) {
  const it = rec(key);
  it.seen++;
  it.score = it.seen === 1 ? score : Math.round(it.score * 0.4 + score * 0.6);
  it.reps = score >= 80 ? it.reps + 1 : 0;
  const gap = it.reps === 1 ? 1 : it.reps === 2 ? 3 : Math.min(30, (2 ** it.reps) * 3);
  it.due = Date.now() + gap * 864e5;
  state.items[key] = it;
  state.log.push({ key, score: it.score, ts: Date.now() });
  save();
  return it;
}

/* ── speech ────────────────────────────────────────── */

let recog = null, voices = [];

function pickVoice() {
  const loc = deck().locale.slice(0, 2);
  const forLocale = voices.filter(v => v.lang.replace("_", "-").startsWith(loc));
  return forLocale[0] || voices[0] || null;
}

function say(text, lang) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = lang || deck().locale;
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

function setupRecog() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    $("#mic-hint").innerHTML = "This browser has no speech recognition.<br>Chrome or Edge needed for scoring — you can still read and hear phrases.";
    $("#mic").disabled = true;
    return false;
  }
  recog = new SR();
  recog.continuous = true;
  recog.interimResults = true;
  recog.lang = deck().locale;

  recog.onresult = e => {
    let fin = "", itm = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      e.results[i].isFinal ? (fin += " " + t) : (itm += " " + t);
    }
    $("#interim").textContent = (fin + itm).trim();
  };
  recog.onend = () => { if (state.listening) try { recog.start(); } catch {} };
  recog.onerror = e => {
    if (e.error === "not-allowed") {
      toast("Microphone blocked. Allow mic access for this page.");
      state.listening = false;
      $("#mic").classList.remove("live");
    }
  };
  return true;
}

function startListen() {
  if (!recog) return;
  state.listening = true;
  state.startedAt = performance.now();
  $("#interim").textContent = "";
  recog.lang = deck().locale;
  try { recog.start(); } catch {}
  $("#mic").classList.add("live");
  $("#mic-hint").textContent = "Listening… let go when you’re done";
  $("#play-prompt").classList.add("speaking");
}

function stopListen() {
  if (!recog) return;
  state.listening = false;
  try { recog.stop(); } catch {}
  $("#mic").classList.remove("live");
  $("#play-prompt").classList.remove("speaking");
  $("#mic-hint").innerHTML = 'Hold <kbd>Space</kbd> to speak &middot; let go to score';
  const heard = $("#interim").textContent.trim();
  if (!heard) return;
  render(score(heard, current().target));
}

/* ── rendering ─────────────────────────────────────── */

const current = () => deck().scenarios[state.scenario];
const item = () => current();

function renderScenarios() {
  $("#scenario-list").innerHTML = deck().scenarios.map((sc, i) => {
    const done = deck().scenarios[i] && countSeen(i);
    const pct = Math.round(avgFor(i));
    return `<button class="scn ${i === state.scenario ? "is-active" : ""}" data-i="${i}">
      <span class="ico">${sc.icon}</span>
      <span>${sc.name}
        <span class="bar-mini"><i style="width:${pct}%"></i></span>
      </span>
      <span class="meta">${done}/5</span>
    </button>`;
  }).join("");
  $$(".scn").forEach(b => b.onclick = () => {
    state.scenario = +b.dataset.i; state.idx = 0;
    $("#report").hidden = true; renderScenarios(); show();
  });
}

function avgFor(i) {
  const vals = deck().scenarios[i] && [0, 1, 2, 3, 4].map(k => rec(sid(deck().scenarios[i], k)).score).filter(Boolean);
  return vals.length ? vals.reduce((a, b) => a + b) / vals.length : 0;
}
function countSeen(i) {
  const sc = deck().scenarios[i];
  return sc ? [0, 1, 2, 3, 4].filter(k => rec(sid(sc, k)).seen).length : 0;
}

function show() {
  const sc = current();
  if (!sc) return;
  $("#setting").textContent = `${sc.icon} ${sc.name}`;
  $("#goal").textContent = sc.prompt;
  $("#prompt-en").textContent = `Partner: “${sc.target}” — ${sc.meaning}`;
  $("#target-text").textContent = sc.target;
  $("#target-note").innerHTML = `<b>${sc.meaning}.</b> ${sc.note}`;
  $("#counter-text").textContent = `${state.idx + 1} / 5`;
  $("#counter-bar").style.width = `${(state.idx / 5) * 100}%`;
  $("#interim").textContent = "";
  $("#report").hidden = true;
  if (recog) try { recog.stop(); } catch {}
  state.listening = false;
  $("#mic").classList.remove("live");
  $("#mic-hint").innerHTML = 'Hold <kbd>Space</kbd> to speak &middot; let go to score';
  const it = rec(itemKey());
  if (it.seen) $("#heard").style.display = "";
}

function render(r) {
  const it = schedule(itemKey(), r.total);
  const grade = r.total >= 85 ? "good" : r.total >= 65 ? "warn" : "bad";
  const verdict = r.total >= 85 ? "Solid" : r.total >= 65 ? "Nearly" : "Not yet";
  const meter = (label, val, color) => `
    <div class="meter"><label><span>${label}</span><span>${val}%</span></label>
      <div class="track"><i style="width:${val}%;background:${color}"></i></div></div>`;

  $("#report").hidden = false;
  $("#report").innerHTML = `
    <div class="report-top">
      <div class="score ${grade}">${r.total}</div>
      <div class="verdict">${verdict}${it.reps > 1 ? ` &middot; seen ${it.seen}x` : ""}
        <small>${it.reps >= 2 ? `Next revisit in ${Math.max(1, Math.round((it.due - Date.now()) / 864e5))} days` :
             it.reps === 1 ? "Comes back tomorrow" : "Back tomorrow until it's clean"}</small>
      </div>
    </div>
    <div class="meters">
      ${meter("Word accuracy", r.accuracy, "#ff5c3a")}
      ${meter("Chunks covered", r.coverage, "#3ddc97")}
      ${meter("Fluency", r.fluency, "#7aa2ff")}
    </div>
    <div class="heard">
      <h4>What the microphone heard &middot; ${r.wpm} wpm${r.fillers ? ` &middot; ${r.fillers} filler${r.fillers > 1 ? "s" : ""}` : ""}</h4>
      <div class="say">${$("#interim").textContent || "<i style='opacity:.5'>silence</i>"}</div>
    </div>
    <div class="coach"><ul>${coach(r).map(c => `<li>${c}</li>`).join("")}</ul></div>`;

  $("#next").textContent = state.idx >= 4 ? "Finish scenario" : "Next phrase";
  renderScenarios();
  renderTable();
}

function renderTable() {
  const rows = [];
  DECKS[state.lang].scenarios.forEach(sc => {
    for (let k = 0; k < 5; k++) {
      const key = sid(sc, k);
      const it = rec(key);
      const due = it.due && it.due <= Date.now();
      const g = !it.score ? "none" : it.score >= 85 ? "good" : it.score >= 65 ? "warn" : "bad";
      rows.push(`<tr class="${due && it.score ? "row-due" : ""}" data-sc="${sc.id}">
        <td class="ph">${sc.target}</td>
        <td class="note-cell">${sc.meaning}<br><span style="color:var(--ink-faint)">${sc.name}</span></td>
        <td class="note-cell">${sc.note}</td>
        <td><span class="pill ${g}">${it.score || "—"}</span></td>
        <td class="note-cell">${it.seen || 0}</td>
        <td class="note-cell">${it.due ? new Date(it.due).toLocaleDateString() : "—"}</td>
        <td><button class="icon-btn" title="Drill this">▶</button></td>
      </tr>`);
    }
  });
  // sort weakest-first: the list's job is to tell you what to fix
  rows.sort((a, b) => (parseInt(a.match(/pill \w+">(-?\d+)</)[1]) || 0) - (parseInt(b.match(/pill \w+">(-?\d+)</)[1]) || 0));
  $("#phrase-table tbody").innerHTML = rows.join("");
  $$("#phrase-table .icon-btn").forEach(b => b.onclick = () => {
    const i = deck().scenarios.findIndex(x => x.id === b.closest("tr").dataset.sc);
    if (i < 0) return;
    state.scenario = i; state.idx = 0;
    switchView("drill"); renderScenarios(); show();
  });
}

function renderStats() {
  const items = Object.values(state.items);
  const seen = items.length;
  const avg = seen ? Math.round(items.reduce((a, i) => a + i.score, 0) / seen) : 0;
  const strong = items.filter(i => i.reps >= 3).length;
  const due = items.filter(i => i.due && i.due <= Date.now()).length;
  const weak = items.filter(i => i.score < 65).length;
  const mins = Math.round(items.reduce((a, i) => a + (i.reps || 1), 0) * 0.6);

  $("#stat-grid").innerHTML = [
    ["Phrases attempted", seen, `${DECKS[state.lang].scenarios.length} situations in deck`],
    ["Average score", avg ? avg + "%" : "—", seen ? "across every phrase" : "say something first"],
    ["Comfortable", strong, "3+ clean passes"],
    ["Due today", due, "weakest come back first"],
    ["Below 65%", weak, "not learned yet"],
    ["Speaking reps", mins + "m", "approx. talk time"]
  ].map(([k, v, d]) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div><div class="d">${d}</div></div>`).join("");

  const recent = state.log.slice(-14).reverse();
  $("#log").innerHTML = recent.length ? recent.map(e => {
    const g = e.score >= 85 ? "good" : e.score >= 65 ? "warn" : "bad";
    return `<div class="log-row">
      <span class="pill ${g}">${e.score}</span>
      <span class="ph">${lookup(e.key)?.target || e.key}</span>
      <span class="t">${new Date(e.ts).toLocaleString()}</span>
    </div>`;
  }).join("") : `<p class="empty">No reps yet. Head to Drill and say something out loud.</p>`;
}

function lookup(key) {
  const [, s, i] = key.split(":");
  return DECKS[state.lang].scenarios.find(x => x.id === s);
}

function switchView(v) {
  $$(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.view === v));
  $$(".view").forEach(s => s.classList.toggle("is-active", s.id === `view-${v}`));
  if (v === "phrases") renderTable();
  if (v === "stats") renderStats();
}

let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => t.hidden = true, 3200);
}

/* ── wiring ────────────────────────────────────────── */

function fillLangSelect() {
  $("#lang").innerHTML = Object.entries(DECKS)
    .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("");
  $("#lang").value = state.lang;
}

function fillVoiceSelect() {
  const sel = $("#voice-select");
  const loc = deck().locale.slice(0, 2);
  const list = voices.filter(v => v.lang.replace("_", "-").startsWith(loc));
  sel.innerHTML = (list.length ? list : voices.slice(0, 8))
    .map(v => `<option value="${v.name}">${v.name} · ${v.lang}</option>`).join("");
  const keep = list.find(v => v.name === localStorage.getItem("cadence.voice"));
  if (keep) sel.value = keep.name;
}

function boot() {
  load();
  if (!DECKS[state.lang]) state.lang = "es-mx";
  fillLangSelect();
  fillVoiceSelect();

  if ("speechSynthesis" in window) {
    const grab = () => { voices = speechSynthesis.getVoices(); fillVoiceSelect(); };
    grab(); speechSynthesis.onvoiceschanged = grab;
  }

  setupRecog();
  state.scenario = 0;
  renderScenarios();
  show();
  renderTable();
  renderStats();

  $("#tabs").onclick = e => { const t = e.target.closest(".tab"); if (t) switchView(t.dataset.view); };
  $("#lang").onchange = e => { state.lang = e.target.value; save(); renderScenarios(); show(); renderTable(); if (recog) recog.lang = deck().locale; };
  $("#voice-select").onchange = e => localStorage.setItem("cadence.voice", e.target.value);

  $("#play-prompt").onclick = () => { say(current().target); toast("Partner said it — now you"); };
  $("#play-target").onclick = () => say(current().target);

  $("#mic").addEventListener("mousedown", startListen);
  $("#mic").addEventListener("touchstart", e => { e.preventDefault(); startListen(); }, { passive: false });
  window.addEventListener("mouseup", stopListen);
  window.addEventListener("touchend", stopListen);

  window.addEventListener("keydown", e => {
    if (e.code === "Space" && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && !state.listening) {
      e.preventDefault(); startListen();
    }
  });
  window.addEventListener("keyup", e => {
    if (e.code === "Space" && state.listening) { e.preventDefault(); stopListen(); }
  });

  $("#next").onclick = () => {
    if (state.idx >= 4) { toast("Scenario done — weakest phrases return tomorrow."); state.idx = 0; }
    else state.idx++;
    show();
  };
  $("#skip").onclick = () => { if (state.idx < 4) state.idx++; show(); };
  $("#heard").onclick = () => { state.idx = state.idx < 4 ? state.idx + 1 : 0; show(); };
  $("#reset").onclick = () => {
    if (!confirm("Wipe all scores and history for every language?")) return;
    state.items = {}; state.log = []; save();
    renderScenarios(); renderTable(); renderStats();
    toast("Progress cleared.");
  };

  document.addEventListener("keypress", e => {
    if (e.key === "Enter" && !$("#report").hidden) $("#next").click();
  });
}

document.addEventListener("DOMContentLoaded", boot);