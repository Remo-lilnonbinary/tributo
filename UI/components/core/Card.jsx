import React from 'react';

/**
 * Tributo Card, the base surface. `paper` (default warm citizen surface),
 * `white`, `raised` (lifts), `sunken` (well), `console` (sharp, near-flat),
 * `ink` (dark navy panel). `interactive` adds hover lift + pointer.
 */
export function Card({
  children,
  variant = 'paper',       // paper | white | raised | sunken | console | ink
  interactive = false,
  padding = 'md',          // none | sm | md | lg
  as = 'div',
  style = {},
  ...rest
}) {
  const pad = { none: 0, sm: 14, md: 20, lg: 28 }[padding];

  const variants = {
    paper:   { background: 'var(--paper)', boxShadow: 'var(--ring-line)', borderRadius: 'var(--radius-lg)', color: 'var(--ink)' },
    white:   { background: 'var(--white)', boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-lg)', color: 'var(--ink)' },
    raised:  { background: 'var(--white)', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-xl)', color: 'var(--ink)' },
    sunken:  { background: 'var(--paper-2)', boxShadow: 'inset 0 1px 2px rgba(22,25,31,0.06)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' },
    console: { background: 'var(--white)', boxShadow: 'var(--ring-line), var(--shadow-console)', borderRadius: 'var(--radius-console)', color: 'var(--ink)' },
    ink:     { background: 'var(--blue-900)', boxShadow: 'none', borderRadius: 'var(--radius-lg)', color: 'var(--paper)' },
  }[variant];

  const Tag = as;
  const base = {
    ...variants,
    padding: pad,
    transition: 'box-shadow var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out)',
    cursor: interactive ? 'pointer' : 'default',
    ...style,
  };

  const onEnter = (e) => {
    if (!interactive) return;
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = variant === 'console' ? 'var(--ring-line-2), var(--shadow-console-pop)' : 'var(--shadow-lg)';
  };
  const onLeave = (e) => {
    if (!interactive) return;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = variants.boxShadow;
  };

  return (
    <Tag style={base} onMouseEnter={onEnter} onMouseLeave={onLeave} {...rest}>
      {children}
    </Tag>
  );
}
