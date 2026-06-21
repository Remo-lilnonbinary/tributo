import React from 'react';

/**
 * Tributo Button.
 * Gold rule: the signal-green `primary` is an ACTION/LIVE accent, at most
 * one per view. `console` variant uses anchor blue for the operator surface.
 */
export function Button({
  children,
  variant = 'primary',     // primary | secondary | ghost | quiet | console | danger
  size = 'md',             // sm | md | lg
  shape = 'pill',          // pill (citizen) | sharp (console)
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 14, padding: '8px 14px', gap: 7, icon: 16, minH: 36 },
    md: { fontSize: 16, padding: '12px 20px', gap: 9, icon: 19, minH: 46 },
    lg: { fontSize: 18, padding: '15px 28px', gap: 10, icon: 22, minH: 56 },
  }[size];

  const radius =
    shape === 'sharp' ? 'var(--radius-console)' : 'var(--radius-pill)';

  const variants = {
    primary: { background: 'var(--signal)', color: '#fff', boxShadow: 'none', border: '1px solid transparent' },
    console: { background: 'var(--blue-600)', color: '#fff', boxShadow: 'none', border: '1px solid transparent' },
    secondary: { background: 'var(--white)', color: 'var(--ink)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-xs)' },
    ghost: { background: 'transparent', color: 'var(--blue-600)', border: '1px solid transparent' },
    quiet: { background: 'var(--paper-2)', color: 'var(--ink)', border: '1px solid transparent' },
    danger: { background: 'var(--alert)', color: '#fff', border: '1px solid transparent' },
  }[variant];

  const isDisabled = disabled || loading;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.gap,
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: sizes.fontSize,
    lineHeight: 1,
    letterSpacing: '-0.005em',
    padding: sizes.padding,
    minHeight: sizes.minH,
    borderRadius: radius,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'background var(--dur-2) var(--ease-out), transform var(--dur-1) var(--ease-out)',
    WebkitTapHighlightColor: 'transparent',
    ...variants,
    ...style,
  };

  const hoverBg = {
    primary: 'var(--signal-600)', console: 'var(--blue-700)',
    secondary: 'var(--paper-2)', ghost: 'var(--blue-50)',
    quiet: 'var(--paper-3)', danger: '#9A2B20',
  }[variant];

  const onEnter = (e) => { if (!isDisabled) e.currentTarget.style.background = hoverBg; };
  const onLeave = (e) => { if (!isDisabled) e.currentTarget.style.background = variants.background; };
  const onDown = (e) => { if (!isDisabled) e.currentTarget.style.transform = 'scale(0.98)'; };
  const onUp = (e) => { e.currentTarget.style.transform = 'scale(1)'; };

  const iconStyle = { width: sizes.icon, height: sizes.icon, flex: '0 0 auto', display: 'inline-flex' };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={base}
      onMouseEnter={onEnter}
      onMouseLeave={(e) => { onLeave(e); onUp(e); }}
      onMouseDown={onDown}
      onMouseUp={onUp}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span aria-hidden="true" style={{
          width: sizes.icon, height: sizes.icon, borderRadius: '50%',
          border: '2px solid currentColor', borderTopColor: 'transparent',
          animation: 'tributo-spin 0.7s linear infinite', display: 'inline-block',
        }} />
      )}
      {!loading && iconLeft && <span aria-hidden="true" style={iconStyle}>{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span aria-hidden="true" style={iconStyle}>{iconRight}</span>}
      <style>{`@keyframes tributo-spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
