# Lovable Implementation Prompt

Build a polished React/TypeScript UI component called `PipAdvisorMascot` for a tax advisory app.

## Goal

Pip should act as a visual partner in the chat/advisory UI. Pip sits calmly when the user is not interacting, listens when the user starts typing, stands up when the user submits a question, thinks while the advisory response is loading, explains while the response streams, and then sits back down once the answer is complete.

## Assets

Use the PNG assets in `02_transparent_pose_sprites/`:

```ts
const pipAssets = {
  idle: "/assets/pip/01_idle_seated_at_desk.png",
  listening: "/assets/pip/02_listening_to_user.png",
  standingUp: "/assets/pip/03_standing_up.png",
  thinking: "/assets/pip/04_thinking_hand_on_chin.png",
  explaining: "/assets/pip/05_explaining_advice_pointing.png",
  speaking: "/assets/pip/06_speaking_with_gestures.png",
  holdingDocument: "/assets/pip/07_holding_a_document.png",
  reassuring: "/assets/pip/08_reassuring_user.png",
  conversing: "/assets/pip/09_conversing_active_listening.png",
  sittingBackDown: "/assets/pip/10_sitting_back_down.png",
  idleAlt: "/assets/pip/11_sitting_idle_alternate.png",
  happy: "/assets/pip/12_happy_waving.png"
};
```

## Component behaviour

Create these states:

- `idle`
- `listening`
- `standingUp`
- `thinking`
- `explaining`
- `speaking`
- `holdingDocument`
- `reassuring`
- `conversing`
- `sittingBackDown`
- `idleAlt`
- `happy`

## Triggers

- When the chat input is focused, set Pip to `listening`.
- When the user is typing, keep Pip in `listening`.
- When the user submits a message, run: `standingUp` for 450ms, then `thinking`.
- While the AI response is loading, show `thinking`.
- When the response begins streaming, alternate between `explaining` and `speaking`.
- If the response references documents, checklist, tax return, forms, or uploaded files, briefly show `holdingDocument`.
- When the response completes, run: `reassuring` for 900ms, then `sittingBackDown` for 500ms, then `idleAlt`.
- If the user is inactive for 10 seconds, return to `idle`.
- On onboarding completion or successful tax task completion, show `happy`.

## Motion

Use CSS or Framer Motion micro-animations:

- Idle: subtle breathing, `scale: 1 → 1.015 → 1`
- Listening: slight forward lean, small nod
- Thinking: tiny bob and loading dots
- Explaining/speaking: gentle gesture pulse
- Reassuring: soft bounce
- Sitting back down: ease-out transition

Do not overanimate. The experience should feel calm, premium, and trustworthy.

## Layout

Place Pip in the centre of the advisory interface, near the chat response area. Pip should feel like the user is speaking with a visual tax companion, not a decorative sticker.

Recommended layout:

- Pip mascot centred above or beside the chat panel.
- A small speech bubble or status label can appear near Pip:
  - "I'm listening"
  - "Let me think that through"
  - "Here's what I'd suggest"
  - "You're on the right track"
- Keep the UI minimal: cream background, navy text, mint accents.

## Visual style

Use these colours:

```css
--pip-navy: #0D1B2A;
--pip-indigo: #1E2A5A;
--pip-mint: #A7E3C1;
--pip-cream: #FFF6E6;
--pip-slate: #6B7280;
```

## Accessibility

- Add meaningful `alt` text for the current Pip state.
- Do not rely on animation alone to communicate status.
- Respect reduced motion preferences:
  - if `prefers-reduced-motion`, disable looping micro-animations and only swap static images.

## Privacy-safe logging

Add a lightweight debug logger:

```ts
function logPipStateChange(previousState, nextState, trigger) {
  console.debug("[PipMascot]", {
    previousState,
    nextState,
    trigger,
    timestamp: new Date().toISOString()
  });
}
```

Never log user tax content, financial details, uploaded document text, or message content.

## Acceptance criteria

- Pip changes state clearly based on user interaction.
- The state transitions feel natural and emotionally responsive.
- No tax content is stored in mascot logs.
- Reduced motion is respected.
- Fallback to `idle` if an image fails to load.
- The component is cleanly documented and easy to extend later into Rive/Lottie animation.
