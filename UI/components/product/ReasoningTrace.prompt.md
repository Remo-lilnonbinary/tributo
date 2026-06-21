The live reasoning trace. Sub-questions appear on the `plan` event (tagged with the planner that produced them); each `retrieval` event animates a step in with coverage % and source/fact counts.

```jsx
<ReasoningTrace steps={[
  { planner:'decompose', question:'Did they cross the £1,000 trading allowance?', coverage:96, sources:2, facts:3, state:'done' },
  { planner:'decompose', question:'What is the filing deadline?', coverage:88, sources:1, facts:2, state:'active' },
  { planner:'expand', question:'Any payments on account?', state:'pending' },
]} />
```
