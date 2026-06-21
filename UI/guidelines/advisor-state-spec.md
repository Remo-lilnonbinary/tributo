# Advisor character, state machine spec

The Tributo advisor is the citizen surface's centrepiece: a friendly animated tax advisor (built as a Rive state machine in production; recreated here in CSS/SVG by `components/product/AdvisorAvatar.jsx`). Its states are **driven by real backend events**, not timers. The answer streams from `POST /api/ask` as Server-Sent Events in this **fixed order**:

```
redaction → plan → retrieval (×N, one per sub-question) → meta → actions → token (streamed ×many) → done
```

Plus three **input** states that come from the client, not the stream: `idle`, `listening`, `error`.

## State table

| # | Trigger (SSE `event`) | Character state | Pose / motion | UI choreography |
|---|---|---|---|---|
|, | client idle | **idle** | slow breathe (`tributo-breathe`, 4s), occasional blink. No glow. | Composer ready. Quick-start prompt chips visible. |
|, | mic pressed | **listening** | leans in; **signal-green glow ring** pulses (`tributo-pulse-glow`); eyes widen slightly. | Mic button fills signal green; live waveform; "Listening…" caption. |
| a | `redaction` | **shielding** | a paper shield sweeps across the face L→R (~520ms); brief squint. | Redaction chips populate the **Privacy** tab ("what PII was removed"). Toast: "Scrubbing personal details…". |
| b | `plan` | **thinking** | eyes drift up; a soft thought-node orbits the head. | **Reasoning trace** panel opens; sub-questions list in, each labelled with the planner that produced it. |
| c | `retrieval` (per sub-q) | **researching** | head tilts; node travels toward the side panel (reading). | Each reasoning step **rises in** (`tributo-rise`) with a coverage % bar + source/fact counts. |
| d | `meta` | **consolidating** | settles upright; node brightens. | Consolidated sources become **citation chips**; exact figures become **fact chips**; **confidence label** set (grounded/escalated); redacted **outbound payload** fills the Privacy tab. |
| e | `actions` | **handing-over** | extends toward the action plan (a gentle "here you go"). | Persistent **to-do list + deadline timeline** slides into view; steps are dated & sourced. |
| f | `token` (streamed) | **speaking** | mouth animates at TTS cadence; subtle nod per clause. | Spoken answer **types out token-by-token** in sync with TTS; caret blinks; captions track. |
| g | `done` | **idle (settled)** | returns to calm idle over ~520ms. | The **cited source document** opens in the Document tab with the relevant passage `<mark>`-highlighted + outbound GOV.UK/HMRC link. |
|, | client/stream error | **error** | gentle frown; glow goes amber once, no pulse. | Inline message: "Something went wrong, your answer wasn't sent anywhere." Retry. Never red-alarm; calm. |

## Driving inputs (Rive state-machine API)
- `mode` (enum): `idle | listening | shielding | thinking | researching | consolidating | handingOver | speaking | error`
- `glow` (number 0–1): intensity of the signal glow (listening & speaking peak ~0.8; idle 0).
- `talkLevel` (number 0–1): mouth openness, fed from TTS amplitude during `speaking`.
- `lookAt` (number −1…1): horizontal gaze, points toward the side panel during `researching`.
- `blinkTrigger`: fired on idle at random 3–7s intervals.

## Accessibility
- Every state has a **text equivalent**: a live `aria-live="polite"` status line mirrors the character state ("Researching your question, 2 of 3 sources…").
- Under `prefers-reduced-motion`: no breathing, no glow pulse, no sweep, states change as **instant cross-fades** and the status line + streamed text carry all meaning. The answer is fully usable with the character hidden.
- Captions/transcript are **always** available alongside voice; the character never carries information that isn't also in text.
