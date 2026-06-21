# Pip Animation State Machine

## Purpose

Pip should feel like a visual partner in the tax advisory experience. Pip sits calmly when inactive, listens when the user interacts, gets up to think, then explains advice with expressive gestures.

## Core loop

```text
idle
  ↓ input_focus / user_typing
listening
  ↓ message_submit
standingUp
  ↓ after 450ms
thinking
  ↓ response_streaming
explaining / speaking
  ↓ response_complete
reassuring
  ↓ after 900ms
sittingBackDown
  ↓ after 500ms
idleAlt or idle
```

## State details

| State | Asset | Trigger | Behaviour |
|---|---|---|---|
| idle | 01_idle_seated_at_desk.png | Default | Calm seated pose, subtle breathing |
| listening | 02_listening_to_user.png | Input focus / typing | Lean forward, attentive |
| standingUp | 03_standing_up.png | Message submitted | Short transition |
| thinking | 04_thinking_hand_on_chin.png | Response loading | Thoughtful pose, loading dots |
| explaining | 05_explaining_advice_pointing.png | Response starts | Pointing / explaining gesture |
| speaking | 06_speaking_with_gestures.png | Response streaming | Conversational gesture |
| holdingDocument | 07_holding_a_document.png | Document/checklist reference | Use when explaining paperwork |
| reassuring | 08_reassuring_user.png | Caveat or closing reassurance | Gentle supportive motion |
| conversing | 09_conversing_active_listening.png | Back-and-forth mode | Active dialogue |
| sittingBackDown | 10_sitting_back_down.png | End response | Transition back to rest |
| idleAlt | 11_sitting_idle_alternate.png | Inactive after answer | Alternate idle |
| happy | 12_happy_waving.png | Success moment | Completion / onboarding / good news |

## Logging

Do log:

- mascot state changes
- UI trigger that caused the change
- asset loading errors
- fallback usage

Do not log:

- user tax details
- HMRC/accounting data
- uploaded document content
- free-text financial details
