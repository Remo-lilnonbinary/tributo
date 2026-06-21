import React from 'react';

/**
 * Tributo Badge, short status pill. Semantic tones map to the system's
 * meaning: `grounded` (confident), `escalated` (handed to a human),
 * `redaction` (PII), plus neutral/info/alert. `dot` shows a leading status dot.
 */
export function Badge({
  children,
  tone = 'neutral',  // neutral | grounded | escalated | redaction | info | alert | live
  dot = false,
  size = 'md',       // sm | md
  style = {},
  ...rest
}) {
  const tones = {
    neutral:   { bg: 'var(--paper-3)', fg: 'var(--ink-2)', dotc: 'var(--ink-3)' },
    grounded:  { bg: 'var(--confidence-grounded-bg)', fg: 'var(--confidence-grounded)', dotc: 'var(--confidence-grounded)' },
    escalated: { bg: 'var(--confidence-escalated-bg)', fg: 'var(--confidence-escalated)', dotc: 'var(--confidence-escalated)' },
    redaction: { bg: 'var(--redaction-bg)', fg: 'var(--redaction)', dotc: 'var(--redaction)' },
    info:      { bg: 'var(--info-bg)', fg: 'var(--blue-700)', dotc: 'var(--blue-500)' },
    alert:     { bg: 'var(--alert-bg)', fg: 'var(--alert)', dotc: 'var(--alert)' },
    live:      { bg: 'var(--signal-100)', fg: 'var(--signal-700)', dotc: 'var(--signal-glow)' },
  }[tone];

  const s = size === 'sm'
    ? { fontSize: 12, padding: '3px 9px', gap: 6, dotSize: 6 }
    : { fontSize: 13, padding: '5px 12px', gap: 7, dotSize: 8 };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      background: tones.bg, color: tones.fg,
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: s.fontSize,
      lineHeight: 1.2, padding: s.padding, borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap', ...style,
    }} {...rest}>
      {dot && (
        <span aria-hidden="true" style={{
          width: s.dotSize, height: s.dotSize, borderRadius: '50%', background: tones.dotc,
          boxShadow: tone === 'live' ? '0 0 0 3px rgba(34,194,129,0.25)' : 'none',
          animation: tone === 'live' ? 'tributo-pulse-glow 1.8s ease-out infinite' : 'none',
        }} />
      )}
      {children}
    </span>
  );
}
