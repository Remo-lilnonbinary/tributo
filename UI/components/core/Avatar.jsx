import React from 'react';

/**
 * Tributo Avatar, initials or icon. `advisor` tone = the signal-green system
 * presence; `human` = a caseworker/adviser (blue); `citizen` = the user (ink).
 */
export function Avatar({
  name = '',
  tone = 'citizen',   // citizen | human | advisor
  size = 40,
  src = null,
  icon = null,
  style = {},
  ...rest
}) {
  const initials = name
    .split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const tones = {
    citizen: { bg: 'var(--paper-3)', fg: 'var(--ink)' },
    human:   { bg: 'var(--blue-100)', fg: 'var(--blue-800)' },
    advisor: { bg: 'var(--signal-100)', fg: 'var(--signal-700)' },
  }[tone];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      background: tones.bg, color: tones.fg,
      fontFamily: 'var(--font-heading)', fontWeight: 700,
      fontSize: Math.round(size * 0.38), lineHeight: 1,
      overflow: 'hidden', flex: '0 0 auto', userSelect: 'none', ...style,
    }} role="img" aria-label={name || undefined} {...rest}>
      {src
        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : icon
          ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span>
          : (initials || '·')}
    </span>
  );
}
