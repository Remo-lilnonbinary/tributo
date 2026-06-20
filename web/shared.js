// Shared helpers for both the citizen app (app.js) and the institution console (gov.js).
// Loaded before them, so $, pct, escapeHtml and runFederated are defined once.
const $ = (id) => document.getElementById(id);
const pct = (x) => Math.round(x * 100);
function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

async function runFederated() {
  $("run-fed").disabled = true; $("run-fed").textContent = "Running…";
  try {
    const r = await (await fetch("/api/federated/run", { method: "POST" })).json();
    $("fed-result").innerHTML = `
      <div class="bars">
        <div class="bar-row"><div class="label"><span>Before, single institution</span><strong>${pct(r.before_accuracy)}%</strong></div>
          <div class="bar-track"><div class="bar-fill before" style="width:${pct(r.before_accuracy)}%"></div></div></div>
        <div class="bar-row"><div class="label"><span>After, federated (${r.num_rounds} rounds)</span><strong>${pct(r.after_accuracy)}%</strong></div>
          <div class="bar-track"><div class="bar-fill after" style="width:${pct(r.after_accuracy)}%"></div></div></div>
      </div>
      <p class="improve">▲ ${r.improvement_points} points, ${r.aggregate_method}, raw data never pooled (chance = ${pct(r.chance_accuracy)}%).</p>
      <p class="muted">${r.feature_space}</p>
      <div class="nodes">${r.nodes.map((n) =>
        `<div class="node"><strong>${n.name}</strong>${n.focus}<br>${n.local_examples} local examples · local-only ${pct(n.local_only_accuracy)}%<br><span class="zero">${n.raw_rows_shared} raw rows shared</span></div>`).join("")}</div>`;
  } finally {
    $("run-fed").disabled = false; $("run-fed").textContent = "Run a federated round";
  }
}
