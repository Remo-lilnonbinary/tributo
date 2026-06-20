// Tributo reference mock. Drives the real backend API; Lovable rebuilds the real UI on top.
// $, pct, escapeHtml and runFederated live in shared.js (loaded first).
const state = { sources: [], lastQuestion: "", asking: false };
const CITIZEN = "maya"; // demo citizen; the action plan persists for them across questions

const EXAMPLES = [
  { label: "Redaction demo", text: "My name is Priya Shah, my NI number is QQ 12 34 56 A and I earned £34,500 from Deliveroo. When do I file Self Assessment?" },
  { label: "Multi-part (agentic)", text: "I started freelancing in May. Do I need to register for Self Assessment, when is the deadline to file, and how much is the personal allowance?" },
  { label: "Escalation", text: "I have cash income I haven't declared. Can I hide some of it to reduce what I owe?" },
  { label: "Off-topic", text: "What is the best recipe for a chocolate cake?" },
];

async function boot() {
  renderExamples();
  wire();
  try {
    const h = await (await fetch("/api/health")).json();
    setPill("pill-flock", h.flock_configured ? "FLock live" : "FLock fallback", h.flock_configured ? "good" : "warn");
    setPill("pill-model", h.model, "");
    setPill("pill-voice", h.voice_configured ? "voice ready" : "voice off", h.voice_configured ? "good" : "warn");
  } catch {
    setPill("pill-flock", "backend offline", "warn");
  }
  loadPlan();
}

async function loadPlan() {
  try {
    const r = await (await fetch(`/api/plan?citizen=${CITIZEN}`)).json();
    if (r.plan && r.plan.length) renderActionPlan(r.plan);
  } catch { /* no plan yet */ }
}
function setPill(id, text, tone) { const el = $(id); el.textContent = text; el.className = "pill" + (tone ? " " + tone : ""); }

function renderExamples() {
  $("examples").innerHTML = "";
  EXAMPLES.forEach((ex) => {
    const b = document.createElement("button");
    b.textContent = ex.label;
    b.onclick = () => { $("question").value = ex.text; ask(); };
    $("examples").appendChild(b);
  });
}

function wire() {
  $("ask").onclick = ask;
  $("question").addEventListener("keydown", (e) => { if (e.key === "Enter") ask(); });
  $("mic").onclick = toggleMic;
  $("run-fed").onclick = runFederated;
  $("view-transparency").onclick = () => showAcctDoc("/api/transparency");
  $("view-modelcard").onclick = () => showAcctDoc("/api/model-card");
  $("export-audit").onclick = exportAudit;
  document.querySelectorAll("#tabs button").forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));
}

function switchTab(tab) {
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  ["document", "privacy", "accountability", "federated"].forEach((t) => ($("tab-" + t).hidden = t !== tab));
}

// ---------- ask (agentic SSE) ----------
async function ask() {
  const q = $("question").value.trim();
  if (!q || state.asking) return;
  state.asking = true; state.lastQuestion = q; state.sources = [];
  $("ask").disabled = true;
  $("transcript").textContent = "";
  $("citations").innerHTML = ""; $("facts").innerHTML = "";
  $("reasoning").hidden = true; $("reasoning").innerHTML = "";
  $("orb").classList.add("speaking");
  setConfidence("thinking…", "");

  try {
    const res = await fetch("/api/ask", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: q, citizen: CITIZEN }),
    });
    await readSSE(res.body, {
      redaction: (d) => renderRedactionChips(d.findings),
      plan: (d) => startReasoning(d),
      retrieval: (d) => addReasoningStep(d),
      meta: (d) => {
        state.sources = d.sources;
        renderCitations(d.sources);
        renderFacts(d.facts || []);
        $("payload").textContent = JSON.stringify(d.outbound_payload, null, 2);
        setConfidence(d.guardrails.confidence, d.guardrails.confidence);
      },
      actions: (d) => renderActionPlan(d.plan),
      token: (d) => { $("transcript").textContent += d.token; },
      done: async () => {
        await refreshAudit();
        if (state.sources.length) openDoc(state.sources[0].id);
        if ($("speak").checked) speak($("transcript").textContent);
        else $("orb").classList.remove("speaking");
      },
    });
  } catch (e) {
    $("transcript").textContent = "Something went wrong: " + e;
  } finally {
    state.asking = false; $("ask").disabled = false;
    if (!$("speak").checked) $("orb").classList.remove("speaking");
  }
}

async function readSSE(stream, handlers) {
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const events = buf.split("\n\n");
    buf = events.pop() || "";
    for (const raw of events) {
      const ev = raw.match(/^event:\s*(.+)$/m)?.[1];
      const data = raw.match(/^data:\s*([\s\S]+)$/m)?.[1];
      if (ev && data && handlers[ev]) handlers[ev](JSON.parse(data));
    }
  }
}

function setConfidence(text, cls) { const el = $("confidence"); el.textContent = text; el.className = "confidence " + (cls || ""); }

// ---------- reasoning trace (the agentic part) ----------
function startReasoning(plan) {
  $("reasoning").hidden = false;
  $("reasoning").innerHTML =
    `<div class="reason-head">Agentic plan <span class="badge">planner: ${plan.planner}</span></div>` +
    `<div id="reason-steps"></div>`;
}
function addReasoningStep(step) {
  const steps = $("reason-steps");
  if (!steps) return;
  const div = document.createElement("div");
  div.className = "reason-step";
  const pct = Math.round(step.coverage * 100);
  const extra = step.hops > 1 ? ` · ${step.hops} hops` : "";
  div.innerHTML =
    `<span class="cov ${step.covered ? "ok" : "no"}">${pct}%</span>` +
    `<div><div>${escapeHtml(step.sub_question)}</div>` +
    `<small>${step.sources.length} source(s) · ${step.facts.length} fact(s)${extra}</small></div>`;
  steps.appendChild(div);
}

function renderCitations(sources) {
  $("citations").innerHTML = "";
  sources.forEach((s) => {
    const c = document.createElement("span");
    c.className = "cite-chip";
    c.textContent = `[${s.citation}] ${s.title}`;
    c.onclick = () => openDoc(s.id);
    $("citations").appendChild(c);
  });
}

function renderFacts(facts) {
  const box = $("facts"); box.innerHTML = "";
  facts.forEach((f) => {
    const c = document.createElement("span");
    c.className = "fact-chip";
    c.innerHTML = `${escapeHtml(f.label)}: <b>${escapeHtml(f.value)}</b>`;
    c.title = "Authoritative figure (source: " + f.source_id + ")";
    c.onclick = () => openDoc(f.source_id);
    box.appendChild(c);
  });
}

// ---------- action plan ("what to do next", persists per citizen) ----------
function renderActionPlan(plan) {
  const box = $("actionplan");
  if (!plan || !plan.length) { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  const dated = plan.filter((p) => p.deadline);
  const timeline = dated.length
    ? `<div class="timeline">${dated.map((p) =>
        `<div class="t-node ${p.done ? "done" : ""}"><span class="t-date">${escapeHtml(p.deadline)}</span><span class="t-title">${escapeHtml(p.title)}</span></div>`).join("")}</div>`
    : "";
  const items = plan.map((p) => `
    <label class="todo ${p.done ? "done" : ""}">
      <input type="checkbox" ${p.done ? "checked" : ""} data-id="${p.id}" />
      <div class="todo-body">
        <div class="todo-title">${escapeHtml(p.title)}${p.deadline ? `<span class="due">by ${escapeHtml(p.deadline)}</span>` : ""}</div>
        <div class="todo-detail">${escapeHtml(p.detail)}</div>
        ${p.citation ? `<span class="todo-src" data-src="${p.source_id}">[${p.citation}] source</span>` : ""}
      </div>
    </label>`).join("");
  box.innerHTML = `<div class="ap-head">What to do next</div>${timeline}<div class="todos">${items}</div>`;
  box.querySelectorAll('input[type=checkbox]').forEach((c) => (c.onchange = () => toggleStep(c.dataset.id)));
  box.querySelectorAll(".todo-src").forEach((s) => (s.onclick = () => openDoc(s.dataset.src)));
}

async function toggleStep(id) {
  const r = await (await fetch("/api/plan/toggle", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ citizen: CITIZEN, id }),
  })).json();
  renderActionPlan(r.plan);
}

// ---------- document panel (advisor "points at" the source) ----------
async function openDoc(id) {
  switchTab("document");
  const doc = await (await fetch("/api/source/" + id)).json();
  $("doc-link").textContent = doc.url; $("doc-link").href = doc.url;
  $("doc-title").textContent = doc.title;
  $("doc-pub").textContent = `${doc.publisher} · ${doc.updated}`;
  $("doc-body").innerHTML = highlight(doc.body, state.lastQuestion);
  $("doc").hidden = false; $("doc-empty").hidden = true;
}

function highlight(body, question) {
  const stop = new Set("a an and are as at be by can do for from have how i if in is it me my need of on or the to was what when with you your should pay".split(" "));
  const terms = [...new Set((question.toLowerCase().match(/[a-z0-9]+/g) || []).filter((t) => t.length > 3 && !stop.has(t)))];
  let out = escapeHtml(body);
  terms.forEach((t) => {
    out = out.replace(new RegExp(`\\b(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
  });
  return out;
}

// ---------- privacy panel ----------
function renderRedactionChips(findings) {
  const box = $("redactions"); box.innerHTML = "";
  if (!findings.length) { box.innerHTML = '<span class="chip none">No personal identifiers detected</span>'; return; }
  findings.forEach((f) => {
    const c = document.createElement("span");
    c.className = "chip"; c.textContent = `${f.type} ×${f.count}`;
    box.appendChild(c);
  });
}

// ---------- accountability ----------
async function refreshAudit() {
  const a = await (await fetch("/api/audit")).json();
  $("audit-count").textContent = `(${a.count})`;
  $("audit").innerHTML = "";
  a.entries.forEach((e) => {
    const div = document.createElement("div");
    div.className = "audit-entry";
    const provTag = e.provider === "flock" ? '<span class="tag flock">FLock</span>' : '<span class="tag demo">local</span>';
    const escTag = e.escalated ? '<span class="tag esc">escalated</span>' : "";
    const steps = (e.trace && e.trace.sub_questions) ? e.trace.sub_questions.length : 0;
    div.innerHTML =
      `<div class="row"><strong>${e.confidence}</strong><span>${provTag} ${escTag}</span></div>` +
      `<div class="muted">${e.timestamp} · ${steps} sub-question(s) · ${e.sources.length} source(s) · ${e.redactions.length} redaction type(s)</div>` +
      `<div>${escapeHtml(e.question_redacted)}</div>`;
    $("audit").appendChild(div);
  });
}

async function showAcctDoc(url) {
  const data = await (await fetch(url)).json();
  const pre = $("acct-doc");
  pre.hidden = false;
  pre.textContent = JSON.stringify(data, null, 2);
}

async function exportAudit() {
  const a = await (await fetch("/api/audit")).json();
  const blob = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "tributo-audit.json"; link.click();
  URL.revokeObjectURL(url);
}

// ---------- voice (browser engine; production = LiveKit + ElevenLabs) ----------
let recognition = null;
function toggleMic() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert("This browser has no Speech Recognition. Type your question instead."); return; }
  if (recognition) { recognition.stop(); return; }
  recognition = new SR();
  recognition.lang = "en-GB"; recognition.interimResults = false;
  $("mic").classList.add("listening");
  recognition.onresult = (e) => { $("question").value = e.results[0][0].transcript; };
  recognition.onend = () => { $("mic").classList.remove("listening"); recognition = null; if ($("question").value.trim()) ask(); };
  recognition.onerror = () => { $("mic").classList.remove("listening"); recognition = null; };
  recognition.start();
}

function speak(text) {
  if (!window.speechSynthesis) { $("orb").classList.remove("speaking"); return; }
  window.speechSynthesis.cancel();
  const sentences = text.match(/[^.!?\n]+[.!?]?/g) || [text];
  let i = 0;
  const next = () => {
    if (i >= sentences.length) { $("orb").classList.remove("speaking"); return; }
    const u = new SpeechSynthesisUtterance(sentences[i++].trim());
    u.lang = "en-GB"; u.onend = next; u.onerror = next;
    window.speechSynthesis.speak(u);
  };
  next();
}

boot();
