import React from 'react';

/**
 * Tributo Tag, category / filter / quick-start chip. Distinct from Badge
 * (which is for statuses). `interactive` makes it a button (quick-start
 * prompts, filters); `leading` slots an icon.
 */
export function Tag({
  children,
  tone = 'default',   // default | blue | live
  interactive = false,
  selected = false,
  leading = null,
  onClick,
  style = {},
  ...rest
}) {
  const tones = {
    default: { bg: 'var(--white)', fg: 'var(--ink)', bd: 'var(--line-2)' },
    blue:    { bg: 'var(--blue-50)', fg: 'var(--blue-700)', bd: 'var(--blue-100)' },
    live:    { bg: 'var(--signal-50)', fg: 'var(--signal-700)', bd: 'var(--signal-100)' },
  }[tone];

  const selStyle = selected
    ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
    : {};

  const Comp = interactive ? 'button' : 'span';

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: tones.bg, color: tones.fg,
    border: `1px solid ${tones.bd}`,
    fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, lineHeight: 1.2,
    padding: '8px 14px', borderRadius: 'var(--radius-pill)',
    cursor: interactive ? 'pointer' : 'default', whiteSpace: 'nowrap',
    transition: 'background var(--dur-2) var(--ease-out), border-color var(--dur-2) var(--ease-out)',
    ...selStyle, ...style,
  };

  const onEnter = (e) => { if (interactive && !selected) e.currentTarget.style.background = 'var(--paper-2)'; };
  const onLeave = (e) => { if (interactive && !selected) e.currentTarget.style.background = tones.bg; };

  return (
    <Comp style={base} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}
      aria-pressed={interactive ? selected : undefined} {...rest}>
      {leading && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{leading}</span>}
      {children}
    </Comp>
  );
}
