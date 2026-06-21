Pins provenance to the answer, Tributo's "every specific is traceable to a source" promise. `source` chips cite a document and link out; `fact` chips show an exact figure in mono with a reference.

```jsx
<CitationChip kind="source" provenance="govuk" index={1} label="Self Assessment tax returns" href="https://gov.uk/..." />
<CitationChip kind="fact" value="£1,000" sourceRef="[1]" />
```

`provenance`: `govuk | hmrc | legislation | corpus`. Use `index` for numbered citations.
