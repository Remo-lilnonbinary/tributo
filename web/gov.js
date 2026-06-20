// Tributo institution console. Read-only operator views onto the same backend the citizen app uses.
// $, pct, escapeHtml and runFederated live in shared.js (loaded first).

function switchTab(t) {
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
  ["overview", "federated", "oversight", "escalations", "settings"].forEach((x) => ($("tab-" + x).hidden = x !== t));
}

async function boot() {
  document.querySelectorAll("#tabs button").forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));
  $("run-fed").onclick = runFederated;
  $("view-transparency").onclick = () => showDoc("/api/transparency");
  $("view-modelcard").onclick = () => showDoc("/api/model-card");
  try { $("pill-model").textContent = (await (await fetch("/api/health")).json()).model; } catch { /* offline */ }
  loadMetrics(); loadAudit(); loadEscalations(); loadSettings();
}

function card(v, k, tone) {
  return `<div class="metric-card ${tone || ""}"><div class="v">${v}</div><div class="k">${k}</div></div>`;
}

async function loadMetrics() {
  const m = await (await fetch("/api/metrics")).json();
  $("metrics").innerHTML =
    card(m.total_questions, "questions answered") +
    card(pct(m.escalation_rate) + "%", "escalated to a human", "warn") +
    card(pct(m.grounded_rate) + "%", "grounded answers", "good") +
    card(m.redactions_removed, "PII items redacted", "good");
}

async function loadAudit() {
  const a = await (await fetch("/api/audit")).json();
  const tb = $("audit-table").querySelector("tbody");
  tb.innerHTML = a.entries.map((e) =>
    `<tr><td>${e.timestamp.replace("T", " ").replace("Z", "")}</td><td>${e.confidence}</td><td>${e.provider}</td><td>${e.sources.length}</td><td>${escapeHtml(e.question_redacted)}</td></tr>`
  ).join("") || `<tr><td colspan="5" class="muted">No questions yet, ask some in the citizen app.</td></tr>`;
}

async function loadEscalations() {
  const r = await (await fetch("/api/escalations")).json();
  $("escalations").innerHTML = r.escalations.map((e) => {
    const unc = e.trace && e.trace.uncovered && e.trace.uncovered.length ? "uncovered: " + e.trace.uncovered.join("; ") + " · " : "";
    return `<div class="esc-card"><strong>${escapeHtml(e.question_redacted)}</strong><div class="reasons">${unc}${e.timestamp.replace("T", " ").replace("Z", "")}</div></div>`;
  }).join("") || '<p class="muted">No escalations yet.</p>';
}

async function loadSettings() {
  $("settings").textContent = JSON.stringify(await (await fetch("/api/settings")).json(), null, 2);
}

async function showDoc(url) {
  $("acct-doc").textContent = JSON.stringify(await (await fetch(url)).json(), null, 2);
}

boot();
