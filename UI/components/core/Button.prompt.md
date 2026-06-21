Tributo's button, use for any action; signal-green `primary` is the one live/action accent (at most one per view), `console` blue is for the operator surface.

```jsx
<Button variant="primary" iconRight={<ArrowRight />}>Ask the advisor</Button>
<Button variant="secondary">See sources</Button>
<Button variant="console" shape="sharp" size="sm">Run round</Button>
```

Variants: `primary` (signal green, citizen CTA) · `secondary` (white + hairline) · `ghost` (text-blue) · `quiet` (paper fill) · `console` (anchor blue, operator) · `danger`. Shapes: `pill` (citizen) / `sharp` (console). Sizes `sm|md|lg`. Supports `iconLeft`/`iconRight`, `loading`, `fullWidth`, `disabled`.
