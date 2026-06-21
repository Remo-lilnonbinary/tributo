Reports the answer's groundedness as a number against a floor every answer must clear. Grounded (green) at/above floor; escalated to a human (amber) below it. The floor is marked on the track.

```jsx
<ConfidenceMeter value={92} floor={75} caption="Grounded in HMRC's own guidance." />
<ConfidenceMeter value={58} floor={75} caption="Too uncertain, handed to a human adviser." />
```
