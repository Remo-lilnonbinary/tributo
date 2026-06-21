The hero. An original, emotive SVG advisor (a friendly tax-document sprite, built from scratch so it can actually act). Pose is driven by real backend SSE events, never timers. Eyes blink, brows emote, arms gesture, and the mouth lip-syncs while speaking. Signal glow only on live modes; fully degrades under reduced-motion.

```jsx
<AdvisorAvatar mode="listening" size={220} />
<AdvisorAvatar mode="researching" />   {/* scans, holds a document */}
<AdvisorAvatar mode="speaking" talkLevel={0.7} />
<AdvisorAvatar mode="handoff" />       {/* gentle "let's get you a human" */}
```

Modes map to backend events: `idle`/`done` calm, `listening` (mic glow), `shielding` (redaction sweep), `thinking` (brow + thought dots), `researching` (eyes scan + held doc), `consolidating`, `handingOver`/`handoff` (escalation, with a "to human" badge), `speaking` (lip-sync), `error` (concerned). Self-contained SVG, no image assets. Full event→state mapping in `guidelines/advisor-state-spec.md`.
