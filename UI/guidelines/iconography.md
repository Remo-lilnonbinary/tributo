# Iconography

**Set:** [Lucide](https://lucide.dev), open-source, even **1.75px** stroke, rounded joins. Friendly enough for the citizen surface, precise enough for the console. Loaded from CDN.

> ⚠️ **Substitution flagged:** no Tributo brand icon set was provided. Lucide is the closest match to the calm, even-weight style of the references. If a brand set exists, replace and re-document here.

## Usage
- Citizen surface: 20–24px, `--ink-2` default, `--signal` only when the icon marks a *live/active* control (mic recording, streaming).
- Console: 16–18px, `--ink-3`, square-ish alignment.
- Stroke width stays **1.75** everywhere for consistency; never mix filled and outline in one view.
- Icons are decorative-by-default → `aria-hidden="true"`, with a real text label beside them. Icon-only buttons get a `tributo-sr-only` label.

## Key glyphs
mic, mic-off, audio-lines (waveform), shield-check (privacy), file-text (document), list-checks (action plan), calendar-clock (deadlines), git-branch / network (federated), scale (accountability/ATRS), badge-check (grounded), user-round (escalation/human), sparkles (advisor presence, used sparingly), arrow-right, x, chevron-down.

## Non-icon glyphs
- Currency: Unicode `£` in IBM Plex Mono for figures/fact chips.
- Flags (rare): Unicode region flags only; never invent flag SVGs.

## Hard rules
- **No emoji** anywhere, citizen or console.
- Never hand-draw an SVG icon when a Lucide equivalent exists.
- The **seal monogram** and **wordmark** are the only bespoke vector marks.

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="shield-check" aria-hidden="true"></i>
<script>lucide.createIcons();</script>
```
