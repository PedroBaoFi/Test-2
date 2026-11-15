/* OrbitFit app logic. Content is in data/content.js — you rarely need to edit this file. */
(function () {
  const C = CONTENT;
  const KEY = "orbitfit.v1";
  const $ = (s, r = document) => r.querySelector(s);
  const dkey = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = () => dkey(new Date());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dayDiff = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------- state ---------------- */
  const def = () => ({
    env: "leo", xp: 0, streak: 0, lastActive: null, lastOpen: null,
    regions: { mind: 40, heart: 40, gut: 40, muscle: 40, shield: 40 },
    done: {}, history: {}, lessons: {}, vitals: [], badges: [], visited: ["leo"],
    bonusDay: null, level: { space: 0, earth: 1 }, tab: "path"
  });
  let S;
  try { S = Object.assign(def(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = def(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // daily decay: the body needs daily training
  (function dailyUpdate() {
    const t = today();
    if (S.lastOpen && S.lastOpen !== t) {
      const gap = Math.min(dayDiff(S.lastOpen, t), 5);
      Object.keys(S.regions).forEach(r => S.regions[r] = Math.max(0, S.regions[r] - 8 * gap));
    }
    if (S.lastActive && dayDiff(S.lastActive, t) > 1) S.streak = 0;
    S.lastOpen = t; save();
  })();

  /* ---------------- helpers ---------------- */
  const env = () => C.environments.find(e => e.id === S.env);
  const tasks = () => [...C.tasks[env().kind], ...(C.envTasks[env().id] || [])];
  const lessons = () => C.lessons.filter(l => l.kind === "both" || l.kind === env().kind);
  const isDone = (id, day = today()) => (S.done[day] || []).includes(id);
  const src = k => k && C.sources[k] ? `<a class="src" target="_blank" rel="noopener" href="${C.sources[k].url}">Source: ${C.sources[k].label}</a>` : "";
  const level = () => Math.floor(S.xp / C.xpPerLevel) + 1;
  const rank = () => C.ranks[Math.min(C.ranks.length - 1, Math.floor((level() - 1) / 2))];
  const regColor = v => v < 35 ? "#ff4b4b" : v < 70 ? "#ffc800" : "#58cc02";
  const taskStreak = id => {
    const h = S.history[id] || []; let d = today();
    if (!h.includes(d)) d = dkey(addDays(new Date(), -1));
    let n = 0; while (h.includes(d)) { n++; d = dkey(addDays(new Date(d + "T00:00:00"), -1)); }
    return n;
  };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200); }
  function confetti() { for (let i = 0; i < 22; i++) { const s = document.createElement("span"); s.className = "confetti"; s.textContent = ["⭐", "✨", "🚀", "🌟"][i % 4]; s.style.left = Math.random() * 100 + "vw"; s.style.animationDelay = Math.random() * .5 + "s"; document.body.appendChild(s); setTimeout(() => s.remove(), 2400); } }
  function openSheet(html) { $("#sheetBody").innerHTML = html; $("#sheet").classList.remove("hidden"); }
  function closeSheet() { $("#sheet").classList.add("hidden"); Q = null; }

  /* ---------------- rewards ---------------- */
  function addXp(n) { if (n > 0) S.xp += n; }
  function addRegion(r, n) { S.regions[r] = clamp(S.regions[r] + n, 0, 100); }
  function touchStreak() {
    const t = today(); if (S.lastActive === t) return;
    S.streak = (S.lastActive && dayDiff(S.lastActive, t) === 1) ? S.streak + 1 : 1; S.lastActive = t;
  }
  function checkBadges() {
    const has = id => S.badges.includes(id), give = id => { if (!has(id)) { S.badges.push(id); toast("🏅 Badge: " + C.badges.find(b => b.id === id).name); } };
    if (Object.values(S.done).some(a => a.length)) give("first");
    if (S.streak >= 3) give("streak3"); if (S.streak >= 7) give("streak7");
    if (Object.values(S.regions).every(v => v >= 70)) give("greens");
    if (Object.values(S.lessons).some(l => l.best === l.total)) give("quiz");
    if (S.visited.length >= 3) give("traveler");
  }
  function completeTask(t) {
    if (isDone(t.id)) return;
    (S.done[today()] = S.done[today()] || []).push(t.id);
    (S.history[t.id] = S.history[t.id] || []).push(today());
    addXp(t.xp); addRegion(t.region, t.gain || 15); touchStreak();
    toast(`+${t.xp} XP  •  ${C.regions[t.region].name} improved`);
    if (tasks().every(x => isDone(x.id)) && S.bonusDay !== today()) { S.bonusDay = today(); addXp(C.dailyBonusXp); confetti(); toast(`🎉 All missions done! +${C.dailyBonusXp} XP`); }
    checkBadges(); save(); render();
  }

  /* ---------------- header & nav ---------------- */
  function renderTop() {
    $("#top").innerHTML = `<button class="av" data-act="profile">🧑‍🚀</button>
      <button class="env" data-act="envs">${env().icon} ${env().name} ▾</button>
      <span class="pill">🔥 ${S.streak}</span><span class="pill">⚡ ${S.xp}</span>`;
    document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.id === S.tab));
  }

  /* ---------------- PATH ---------------- */
  const OFFS = [0, 38, 58, 38, 0, -38, -58, -38];
  function nodeHtml(i, cls, icon, title, act, id, extra = "") {
    return `<button class="node ${cls}" style="transform:translateX(${OFFS[i % 8]}px)" data-act="${act}" data-id="${id}">
      <div class="c">${icon}${cls.includes("done") ? '<span class="tick">✓</span>' : ""}${extra}</div><div class="t">${title}</div></button>`;
  }
  function renderPath() {
    const e = env(), ts = tasks(), ls = lessons();
    const doneN = ts.filter(t => isDone(t.id)).length;
    let i = 0;
    const tn = ts.map(t => { const st = taskStreak(t.id); return nodeHtml(i++, isDone(t.id) ? "done" : "", t.icon, t.title.split(/[:(]/)[0], "task", t.id, st >= 2 ? `<span class="fl">🔥${st}</span>` : ""); }).join("");
    const ln = ls.map(l => { const b = S.lessons[l.id]; return nodeHtml(i++, "lesson" + (b ? " done" : ""), l.icon, l.title, "lesson", l.id); }).join("");
    return `<div class="banner"><div class="l"><small>${e.kind === "earth" ? "EARTH MODE" : "MISSION • " + e.name.toUpperCase()}</small><b>Daily missions (${doneN}/${ts.length})</b></div><button data-act="brief">📋</button></div>
      <div class="bar"><i style="width:${doneN / ts.length * 100}%"></i></div>
      <div class="path">${tn}</div>
      <div class="divider">Learn</div>
      <div class="path">${ln}</div>`;
  }

  /* ---------------- BODY ---------------- */
  function renderBody() {
    const R = S.regions, col = r => regColor(R[r]);
    const avg = Math.round(Object.values(R).reduce((a, b) => a + b, 0) / 5);
    const shape = (r, inner, ic, x, y) => `<g class="reg" data-act="region" data-id="${r}">${inner.replace("/>", ` style="fill:${col(r)}"/>`)}<text x="${x}" y="${y}">${ic}</text></g>`;
    const svg = `<svg class="bodysvg" viewBox="0 0 200 340">
      ${shape("shield", `<rect x="14" y="92" width="34" height="120" rx="17" transform="rotate(10 31 92)"/>`, "🛡️", 29, 150)}
      <g class="reg" data-act="region" data-id="shield"><rect x="152" y="92" width="34" height="120" rx="17" transform="rotate(-10 169 92)" style="fill:${col("shield")}"/><text x="171" y="150">🛡️</text></g>
      ${shape("mind", `<circle cx="100" cy="42" r="32"/>`, "🧠", 100, 42)}
      ${shape("heart", `<rect x="58" y="82" width="84" height="64" rx="24"/>`, "❤️", 100, 114)}
      ${shape("gut", `<rect x="62" y="150" width="76" height="56" rx="22"/>`, "🍎", 100, 178)}
      ${shape("muscle", `<rect x="60" y="210" width="36" height="118" rx="18"/>`, "💪", 78, 268)}
      <g class="reg" data-act="region" data-id="muscle"><rect x="104" y="210" width="36" height="118" rx="18" style="fill:${col("muscle")}"/><text x="122" y="268">💪</text></g>
    </svg>`;
    const leg = Object.keys(R).map(r => `<button class="lg" data-act="region" data-id="${r}"><b>${C.regions[r].icon} ${C.regions[r].name}</b><div class="bar"><i style="width:${R[r]}%;background:${regColor(R[r])}"></i></div></button>`).join("");
    return `<h2>Body status — ${avg}% ready</h2>
      <div class="bodywrap">${svg}<div class="legend">${leg}</div></div>
      <p class="mute small">Tap a body part. Complete missions to turn it green — untrained parts fade back toward red each day.</p>
      <div class="card"><b>${env().icon} ${env().name}</b><p class="small">${env().brief}</p>${src(env().src)}</div>`;
  }
  function regionSheet(r) {
    const g = C.regions[r], k = env().kind, ts = tasks().filter(t => t.region === r);
    openSheet(`<h2>${g.icon} ${g.name}</h2>
      <div class="bar"><i style="width:${S.regions[r]}%;background:${regColor(S.regions[r])}"></i></div>
      <p>${g[k]}</p>${src(g.src)}
      <h3 style="margin-top:14px">Missions for this body part</h3>
      ${ts.map(t => `<div class="card small">${isDone(t.id) ? "✅" : "⬜"} ${t.icon} ${t.title}</div>`).join("") || '<p class="mute">No missions here in this environment.</p>'}`);
  }

  /* ---------------- HEALTH ---------------- */
  const vStatus = (v, x) => x >= v.ok[0] && x <= v.ok[1] ? "good" : x >= v.watch[0] && x <= v.watch[1] ? "watch" : "alert";
  const lastVital = id => { for (let i = S.vitals.length - 1; i >= 0; i--) if (S.vitals[i].id === id) return S.vitals[i]; return null; };
  function spark(id) {
    const pts = S.vitals.filter(x => x.id === id).slice(-8); if (pts.length < 2) return "";
    const vs = pts.map(p => p.v), mn = Math.min(...vs), mx = Math.max(...vs), rg = (mx - mn) || 1;
    const d = pts.map((p, i) => `${(i / (pts.length - 1) * 100).toFixed(1)},${(26 - (p.v - mn) / rg * 22).toFixed(1)}`).join(" ");
    return `<svg viewBox="0 0 100 30" width="100%" height="30" preserveAspectRatio="none"><polyline points="${d}" fill="none" stroke="#6cc4ff" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function renderHealth() {
    const alerts = C.vitals.filter(v => { const l = lastVital(v.id); return l && vStatus(v, l.v) === "alert"; });
    const cards = C.vitals.map(v => {
      const l = lastVital(v.id), st = l ? vStatus(v, l.v) : "none";
      return `<button class="vit s-${st} ${st}" data-act="vital" data-id="${v.id}"><div class="n">${v.icon} ${v.name}</div>
        <div class="v"><span class="dot"></span>${l ? l.v + " <small>" + v.unit + "</small>" : "—"}</div>${spark(v.id)}</button>`;
    }).join("");
    return `<h2>Health log</h2>
      ${alerts.length ? `<div class="alertbar">⚠️ <b>${alerts.map(a => a.name).join(", ")}</b> outside the typical range. <button class="btn red" data-act="tab" data-id="sos">Open SOS</button></div>` : ""}
      <p class="mute small">Tap an indicator to log it. 🟢 typical • 🟡 watch • 🔴 alert. Reference ranges are typical adult values for demonstration only — not medical advice.</p>
      <div class="grid">${cards}</div>
      <div class="card" style="margin-top:12px"><b>Why these measures?</b><p class="small">The challenge suggests blood pressure, heart rate, blood sugar, body temperature, daily sleep hours and mood. NASA's Standard Measures collect a consistent set like this from every crew.</p>${src("research")}</div>`;
  }
  function vitalSheet(id) {
    const v = C.vitals.find(x => x.id === id), hist = S.vitals.filter(x => x.id === id).slice(-5).reverse();
    const input = v.scale ? `<div class="moods" id="moods">${["😞", "😕", "😐", "🙂", "😄"].map((m, i) => `<button data-act="mood" data-id="${i + 1}">${m}</button>`).join("")}</div><input type="hidden" id="vin" value="">`
      : `<input class="field" id="vin" type="number" inputmode="decimal" step="any" min="${v.min}" max="${v.max}" placeholder="${v.unit}">`;
    openSheet(`<h2>${v.icon} ${v.name}</h2><p class="small mute">${v.why}</p>${src(v.src)}
      <p class="small">Typical: ${v.ok[0]}–${v.ok[1]} ${v.unit}</p>${input}
      <button class="btn" data-act="savevital" data-id="${id}">Save</button>
      ${hist.length ? `<h3 style="margin-top:14px">Recent</h3>${hist.map(h => `<div class="small"><span class="dot ${vStatus(v, h.v)}"></span>${h.v} ${v.unit} <span class="mute">— ${h.day}</span></div>`).join("")}` : ""}`);
  }
  function saveVital(id) {
    const v = C.vitals.find(x => x.id === id), x = parseFloat($("#vin").value);
    if (isNaN(x) || x < v.min || x > v.max) return toast(`Enter a value between ${v.min} and ${v.max}`);
    const st = vStatus(v, x);
    S.vitals.push({ id, v: x, day: today(), ts: Date.now() });
    if (S.vitals.length > 500) S.vitals.shift();
    addRegion(v.region, st === "good" ? 6 : st === "watch" ? 2 : 0); addXp(3);
    const auto = tasks().find(t => t.auto === "vitals"); if (auto) completeTask(auto);
    closeSheet(); toast(C.vitalMessages[st]); save(); render();
  }

  /* ---------------- SOS ---------------- */
  let F = null;
  function renderSOS() {
    const list = C.sos[env().kind];
    if (!F) return `<h2>🆘 Emergency triage</h2><p class="mute small">${C.sosDisclaimer}</p>` +
      list.map(s => `<button class="sc" data-act="sos" data-id="${s.id}"><span>${s.icon}</span><b>${s.title}</b></button>`).join("");
    const sc = list.find(s => s.id === F.id), n = sc.n[F.node];
    const head = `<button class="btn ghost" style="margin:0 0 12px;width:auto;display:inline-block;padding:8px 14px" data-act="sosback">← All scenarios</button><h2>${sc.icon} ${sc.title}</h2>`;
    if (n.q) return head + `<div class="card"><b>${n.q}</b></div>` + n.o.map(o => `<button class="opt" data-act="sosnext" data-id="${o[1]}">${o[0]}</button>`).join("");
    const r = n.r;
    return head + `<div class="res ${r.sev}"><h3>${r.sev === "critical" ? "🚨 " : ""}${r.t}</h3><ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol></div>
      <p class="mute small">${C.sosDisclaimer}</p><button class="btn ghost" data-act="sos" data-id="${sc.id}">Restart</button>`;
  }

  /* ---------------- RADIATION ---------------- */
  function renderRad() {
    const k = env().kind, R = C.radiation[k], lv = (S.level && S.level[k]) || 0, cur = R.levels[Math.min(lv, R.levels.length - 1)];
    const cls = c => c === "ok" ? "good" : c;
    const streakCard = k === "earth" ? `<div class="card">🧴 <b>Sunscreen streak: ${taskStreak("ea-spf")} day(s)</b><p class="small mute">Complete the “Apply SPF 30+” mission every day.</p></div>` : "";
    return `<h2>${k === "space" ? "☢️" : "☀️"} ${R.title}</h2>
      <div class="lvls">${R.levels.map((l, i) => `<button class="${cls(l.color)} ${i === lv ? "on" : ""}" data-act="rad" data-id="${i}">${l.name}</button>`).join("")}</div>
      <div class="res ${cur.color === "alert" ? "critical" : cur.color === "watch" ? "caution" : "ok"}"><h3>${cur.name}</h3><ol>${cur.advice.map(a => `<li>${a}</li>`).join("")}</ol></div>
      ${streakCard}<h2 style="margin-top:16px">Know your radiation</h2>
      ${R.facts.map(f => `<div class="fact"><b>${f.t}</b><div class="small">${f.d}</div>${src(f.src)}</div>`).join("")}`;
  }

  /* ---------------- QUIZ ---------------- */
  let Q = null;
  function quizStart(id) { const l = C.lessons.find(x => x.id === id); Q = { l, i: 0, score: 0, picked: null, order: shuffle(l.q[0].a.map((_, k) => k)) }; quizRender(); }
  function quizRender() {
    const { l, i } = Q;
    if (i >= l.q.length) return quizEnd();
    const q = l.q[i], ans = Q.picked !== null;
    Q.order = Q.order || shuffle(q.a.map((_, k) => k));
    openSheet(`<small class="mute">${l.icon} ${l.title} • ${i + 1}/${l.q.length}</small><div class="bar" style="margin:8px 0 14px"><i style="width:${i / l.q.length * 100}%"></i></div>
      <h3>${q.q}</h3>
      ${Q.order.map(k => `<button class="opt ${ans ? (k === q.c ? "right" : k === Q.picked ? "wrong" : "") : ""}" data-act="pick" data-id="${k}" ${ans ? "disabled" : ""}>${q.a[k]}</button>`).join("")}
      ${ans ? `<p class="small">${Q.picked === q.c ? "✅ Correct! " : "❌ Not quite. "}${q.e}</p>${src(l.src)}<button class="btn" data-act="qnext">Continue</button>` : ""}`);
  }
  function quizEnd() {
    const { l, score } = Q, total = l.q.length, prev = S.lessons[l.id], best = prev ? prev.best : 0;
    let gain = Math.max(0, score - best) * 5; if (score === total && best < total) gain += 10;
    addXp(gain); if (!prev) addRegion(l.region, 10);
    S.lessons[l.id] = { best: Math.max(best, score), total }; touchStreak(); checkBadges(); save();
    if (score === total) confetti();
    openSheet(`<h2>${score === total ? "🎉 Perfect!" : "Lesson complete"}</h2><p>You scored <b>${score}/${total}</b>${gain ? ` and earned <b>+${gain} XP</b>` : ""}.</p>
      <button class="btn" data-act="close">Continue</button>`); Q = null; render();
  }

  /* ---------------- sheets ---------------- */
  function envSheet() {
    openSheet(`<h2>Choose your environment</h2>` + C.environments.map(e => `<button class="envc ${e.id === S.env ? "on" : ""}" data-act="setenv" data-id="${e.id}"><span>${e.icon}</span><div><b>${e.name}</b><div class="small mute">Gravity: ${e.gravity} • Comms delay: ${e.delay}</div></div></button>`).join(""));
  }
  function briefSheet() {
    const e = env();
    openSheet(`<h2>${e.icon} ${e.name} briefing</h2><p>${e.brief}</p>
      <div class="card small">Gravity: <b>${e.gravity}</b><br>Communication delay: <b>${e.delay}</b></div>
      <h3>Main health focus</h3><ul>${e.focus.map(f => `<li>${f}</li>`).join("")}</ul>${src(e.src)}`);
  }
  function taskSheet(id) {
    const t = tasks().find(x => x.id === id), done = isDone(id), st = taskStreak(id);
    const btn = done ? `<button class="btn ghost" disabled>✓ Done today</button>`
      : t.auto === "vitals" ? `<button class="btn" data-act="tab" data-id="health">Open Health log</button>`
      : `<button class="btn" data-act="complete" data-id="${id}">Mark done (+${t.xp} XP)</button>`;
    openSheet(`<h2>${t.icon} ${t.title}</h2><p class="small mute">Trains: ${C.regions[t.region].icon} ${C.regions[t.region].name}</p>
      <p>${t.why}</p>${src(t.src)}${st ? `<p>🔥 <b>${st}-day streak</b></p>` : ""}${btn}`);
  }
  function profileSheet() {
    openSheet(`<h2>🧑‍🚀 ${rank()} • Level ${level()}</h2>
      <div class="bar"><i style="width:${(S.xp % C.xpPerLevel) / C.xpPerLevel * 100}%"></i></div>
      <p class="small mute">${S.xp} XP • ${S.streak}-day streak</p>
      <h3>Badges</h3><div class="badges">${C.badges.map(b => `<div class="badge ${S.badges.includes(b.id) ? "on" : ""}"><span>${b.icon}</span><b>${b.name}</b><br>${b.desc}</div>`).join("")}</div>
      <button class="btn ghost" data-act="science">🔬 Science & sources</button>
      <button class="btn ghost" data-act="reset">Reset progress</button>`);
  }
  function scienceSheet() {
    openSheet(`<h2>🔬 How OrbitFit uses NASA research</h2>
      <p class="small mute">Built for the NASA Space Apps 2026 “Health Monitoring Software” challenge. Educational prototype — not a medical device.</p>
      ${C.science.map(s => `<div class="fact"><b>${s.n}</b><div class="small">${s.d}<br><i>In the app:</i> ${s.used}</div>${src(s.src)}</div>`).join("")}
      <h3>All sources</h3>${Object.values(C.sources).map(s => `<div class="small"><a target="_blank" rel="noopener" href="${s.url}">${s.label}</a></div>`).join("")}`);
  }

  /* ---------------- render & events ---------------- */
  function render() {
    renderTop();
    const v = { path: renderPath, body: renderBody, health: renderHealth, sos: renderSOS, rad: renderRad }[S.tab];
    $("#view").innerHTML = v();
  }
  function go(t) { S.tab = t; if (t !== "sos") F = null; save(); closeSheet(); render(); $("#view").scrollTop = 0; }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.dataset.id;
    switch (b.dataset.act) {
      case "tab": go(id); break;
      case "close": closeSheet(); break;
      case "profile": profileSheet(); break;
      case "science": scienceSheet(); break;
      case "reset": if (confirm("Erase all progress?")) { localStorage.removeItem(KEY); location.reload(); } break;
      case "envs": envSheet(); break;
      case "setenv": S.env = id; if (!S.visited.includes(id)) S.visited.push(id); F = null; checkBadges(); save(); closeSheet(); render(); break;
      case "brief": briefSheet(); break;
      case "task": taskSheet(id); break;
      case "complete": closeSheet(); completeTask(tasks().find(t => t.id === id)); break;
      case "lesson": quizStart(id); break;
      case "pick": if (Q && Q.picked === null) { Q.picked = +id; if (+id === Q.l.q[Q.i].c) Q.score++; quizRender(); } break;
      case "qnext": Q.i++; Q.picked = null; Q.order = null; quizRender(); break;
      case "region": regionSheet(id); break;
      case "vital": vitalSheet(id); break;
      case "mood": $("#vin").value = id; document.querySelectorAll("#moods button").forEach(x => x.classList.toggle("sel", x.dataset.id === id)); break;
      case "savevital": saveVital(id); break;
      case "sos": F = { id, node: C.sos[env().kind].find(s => s.id === id).start }; render(); break;
      case "sosnext": F.node = id; render(); break;
      case "sosback": F = null; render(); break;
      case "rad": S.level = S.level || {}; S.level[env().kind] = +id; save(); render(); break;
    }
  });

  checkBadges(); save(); render();
})();
