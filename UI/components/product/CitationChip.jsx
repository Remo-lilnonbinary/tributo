import React from 'react';

/**
 * Tributo CitationChip, pins provenance to the answer. Two kinds:
 *  - `source`  : a consolidated citation to a document (GOV.UK / HMRC /
 *                legislation / internal corpus), links out.
 *  - `fact`    : an exact figure lifted from a source, shown in mono.
 * First-party / official sources read blue; the figure itself reads ink.
 */
export function CitationChip({
  kind = 'source',   // source | fact
  provenance = 'govuk',  // govuk | hmrc | legislation | corpus
  label,             // source title  (kind=source)
  value,             // the figure    (kind=fact)
  sourceRef,         // e.g. "[1]" or "HMRC SA100"  (kind=fact)
  href,
  index,             // citation number e.g. 1
  onClick,
  style = {},
  ...rest
}) {
  const prov = {
    govuk:       { fg: 'var(--blue-700)', bg: 'var(--blue-50)', bd: 'var(--blue-100)', name: 'GOV.UK' },
    hmrc:        { fg: 'var(--blue-800)', bg: 'var(--blue-50)', bd: 'var(--blue-100)', name: 'HMRC' },
    legislation: { fg: 'var(--ink)', bg: 'var(--paper-3)', bd: 'var(--line-2)', name: 'Legislation' },
    corpus:      { fg: 'var(--ink-2)', bg: 'var(--paper-2)', bd: 'var(--line-2)', name: 'Corpus' },
  }[provenance];

  if (kind === 'fact') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 7,
        background: 'var(--white)', border: '1px solid var(--line-2)',
        borderRadius: 'var(--radius-sm)', padding: '4px 10px',
        fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)',
        boxShadow: 'var(--shadow-xs)', whiteSpace: 'nowrap', ...style,
      }} {...rest}>
        {value}
        {sourceRef && <sup style={{ fontSize: 10, color: 'var(--blue-600)', fontWeight: 700 }}>{sourceRef}</sup>}
      </span>
    );
  }

  const Comp = href || onClick ? 'a' : 'span';
  return (
    <Comp
      href={href} onClick={onClick} target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: prov.bg, border: `1px solid ${prov.bd}`,
        borderRadius: 'var(--radius-pill)', padding: '5px 12px 5px 7px',
        fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500,
        color: prov.fg, textDecoration: 'none', cursor: href || onClick ? 'pointer' : 'default',
        maxWidth: 280, ...style,
      }} {...rest}>
      {typeof index === 'number' && (
        <span aria-hidden="true" style={{
          width: 20, height: 20, borderRadius: '50%', background: prov.fg, color: prov.bg,
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
        }}>{index}</span>
      )}
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
        textTransform: 'uppercase', opacity: 0.7,
      }}>{prov.name}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </Comp>
  );
}
