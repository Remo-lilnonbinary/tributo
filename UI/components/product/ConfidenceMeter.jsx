import React from 'react';

/**
 * Tributo ConfidenceMeter, reports the answer's groundedness as a number
 * against a floor every answer must clear. At/above floor reads grounded
 * (green); below floor the answer is escalated to a human (amber). Honest
 * about uncertainty instead of promising perfection.
 */
export function ConfidenceMeter({
  value = 0,         // 0..100
  floor = 75,
  label = 'Confidence',
  caption,
  size = 'md',       // sm | md
  style = {},
  ...rest
}) {
  const grounded = value >= floor;
  const color = grounded ? 'var(--confidence-grounded)' : 'var(--confidence-escalated)';
  const track = grounded ? 'var(--confidence-grounded-bg)' : 'var(--confidence-escalated-bg)';
  const h = size === 'sm' ? 8 : 12;

  return (
    <div style={{ fontFamily: 'var(--font-body)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: size === 'sm' ? 13 : 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: size === 'sm' ? 14 : 17, color }}>
            {Math.round(value)}%
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {grounded ? 'Grounded' : 'Escalated'}
          </span>
        </span>
      </div>
      <div style={{ position: 'relative', height: h, background: track, borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}
        role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div style={{
          position: 'absolute', inset: 0, width: `${Math.min(100, Math.max(0, value))}%`,
          background: color, borderRadius: 'var(--radius-pill)',
          transition: 'width var(--dur-4) var(--ease-out)',
        }} />
        {/* floor marker */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -2, bottom: -2, left: `${floor}%`,
          width: 2, background: 'var(--ink)', opacity: 0.55,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {caption
          ? <span style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.4 }}>{caption}</span>
          : <span />}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-4)' }}>floor {floor}%</span>
      </div>
    </div>
  );
}
