Status pill for short states. Semantic tones map to Tributo's meaning, `grounded` = confident, `escalated` = handed to a human, `redaction` = PII. `live` pulses for active states.

```jsx
<Badge tone="grounded" dot>Grounded</Badge>
<Badge tone="escalated" dot>Escalated to human</Badge>
<Badge tone="live" dot>Answering now</Badge>
```

Tones: `neutral | grounded | escalated | redaction | info | alert | live`. `dot` adds a status dot; `size` = `sm|md`.
