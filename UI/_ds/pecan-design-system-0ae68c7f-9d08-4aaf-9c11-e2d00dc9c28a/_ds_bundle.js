/* @ds-bundle: {"format":3,"namespace":"PecanDesignSystem_0ae68c","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"EmailCard","sourcePath":"components/product/EmailCard.jsx"},{"name":"EmpathyMeter","sourcePath":"components/product/EmpathyMeter.jsx"},{"name":"GateStatus","sourcePath":"components/product/GateStatus.jsx"},{"name":"SourceChip","sourcePath":"components/product/SourceChip.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"e4f4777c2edf","components/core/Badge.jsx":"84c11499b78d","components/core/Button.jsx":"7cd1e41f6804","components/core/Card.jsx":"9186d9416859","components/core/Input.jsx":"e3f416571a38","components/core/Tag.jsx":"ca9b8455bf37","components/product/EmailCard.jsx":"22befbd89cb8","components/product/EmpathyMeter.jsx":"4471e44e5d7c","components/product/GateStatus.jsx":"3566d1e409e1","components/product/SourceChip.jsx":"6738f7cf9c0d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PecanDesignSystem_0ae68c = window.PecanDesignSystem_0ae68c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan Avatar — initials chip. Gold for the active user / sender,
 * ink for recipients. Square-ish rounded by default (matches the UI),
 * circle optional.
 */
function Avatar({
  name = '',
  size = 36,
  tone = 'ink',
  shape = 'rounded',
  src = null,
  style = {},
  ...rest
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
  const tones = {
    ink: {
      bg: 'var(--ink)',
      fg: 'var(--on-ink)'
    },
    gold: {
      bg: 'var(--gold)',
      fg: 'var(--ink)'
    },
    soft: {
      bg: 'var(--paper-3)',
      fg: 'var(--muted-2)'
    }
  };
  const t = tones[tone] || tones.ink;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: shape === 'circle' ? '50%' : 'calc(var(--r-sm) + 1px)',
      background: src ? 'transparent' : t.bg,
      color: t.fg,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.36),
      letterSpacing: '-0.02em',
      overflow: 'hidden',
      userSelect: 'none',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan Badge — a small status pill. Gold = verified/positive,
 * alert = blocked, ink/neutral for everything else.
 */
function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--paper-2)',
      fg: 'var(--muted-2)',
      bd: 'var(--border)'
    },
    ink: {
      bg: 'var(--ink)',
      fg: 'var(--on-ink)',
      bd: 'var(--ink)'
    },
    gold: {
      bg: 'var(--gold-wash)',
      fg: 'var(--gold-deep)',
      bd: 'var(--gold-line)'
    },
    solid: {
      bg: 'var(--gold)',
      fg: 'var(--ink)',
      bd: 'var(--gold)'
    },
    alert: {
      bg: 'var(--alert-wash)',
      fg: 'var(--alert)',
      bd: 'rgba(155,58,52,0.35)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '2px 8px' : '3px 11px';
  const fs = size === 'sm' ? 11 : 12;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
      color: t.fg,
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--r-pill)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor',
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan Button — the primary action primitive.
 * Gold = the one accent, reserved for the single most important action
 * on a view. Everything else is ink, outline, or ghost.
 */
function Button({
  variant = 'primary',
  size = 'md',
  shape = 'round',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  as = 'button',
  className = '',
  style = {},
  children,
  ...rest
}) {
  const sizes = {
    sm: {
      height: 34,
      padding: '0 14px',
      fontSize: 14,
      gap: 7
    },
    md: {
      height: 42,
      padding: '0 20px',
      fontSize: 15,
      gap: 8
    },
    lg: {
      height: 52,
      padding: '0 28px',
      fontSize: 16,
      gap: 9
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--gold)',
      color: 'var(--accent-contrast)',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'var(--ink)',
      color: 'var(--on-ink)',
      border: '1px solid var(--ink)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1px solid transparent'
    }
  };
  const v = variants[variant] || variants.primary;
  const base = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    borderRadius: shape === 'pill' ? 'var(--r-pill)' : 'var(--r-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    boxSizing: 'border-box',
    ...v,
    ...style
  };
  const hover = (e, on) => {
    if (disabled) return;
    if (variant === 'primary') {
      e.currentTarget.style.background = on ? 'var(--gold-soft)' : 'var(--gold)';
      e.currentTarget.style.boxShadow = on ? 'var(--shadow-gold)' : 'none';
      e.currentTarget.style.transform = on ? 'translateY(-1px)' : 'none';
    } else if (variant === 'secondary') {
      e.currentTarget.style.background = on ? 'var(--ink-soft)' : 'var(--ink)';
      e.currentTarget.style.transform = on ? 'translateY(-1px)' : 'none';
    } else {
      e.currentTarget.style.background = on ? 'var(--paper-2)' : 'transparent';
      if (variant === 'outline') e.currentTarget.style.borderColor = on ? 'var(--muted)' : 'var(--border-strong)';
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: className,
    style: base,
    disabled: as === 'button' ? disabled : undefined,
    onMouseEnter: e => hover(e, true),
    onMouseLeave: e => hover(e, false),
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
    },
    onMouseUp: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan Card — the base surface container. White by default; `dark`
 * for ink panels, `pixel` adds a faint retro grid wash. Hairline
 * border, soft warm shadow.
 */
function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  accent = false,
  className = '',
  style = {},
  children,
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 16,
    md: 22,
    lg: 30
  };
  const p = pads[padding] ?? pads.md;
  const variants = {
    default: {
      background: 'var(--surface)',
      color: 'var(--ink)',
      border: '1px solid var(--border)'
    },
    raised: {
      background: 'var(--surface)',
      color: 'var(--ink)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)'
    },
    sunken: {
      background: 'var(--paper-2)',
      color: 'var(--ink)',
      border: '1px solid var(--border)'
    },
    dark: {
      background: 'var(--ink)',
      color: 'var(--on-ink)',
      border: '1px solid var(--ink-line)'
    }
  };
  const v = variants[variant] || variants.default;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      position: 'relative',
      borderRadius: 'var(--r-lg)',
      padding: p,
      fontFamily: 'var(--font-sans)',
      transition: 'transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out), border-color var(--dur-mid) var(--ease-out)',
      ...v,
      ...(accent ? {
        borderColor: 'var(--gold-line)'
      } : null),
      ...(interactive && hover ? {
        transform: 'translateY(-2px)',
        boxShadow: 'var(--shadow-lg)',
        borderColor: 'var(--gold-line)'
      } : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan Input — labelled text field. Clean white, hairline border,
 * gold focus ring. Pairs label + optional hint/error.
 */
function Input({
  label = '',
  hint = '',
  error = '',
  size = 'md',
  leading = null,
  trailing = null,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const h = size === 'sm' ? 38 : 44;
  const borderColor = error ? 'var(--alert)' : focus ? 'var(--gold-deep)' : 'var(--border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)',
      letterSpacing: '-0.005em'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: '0 12px',
      background: 'var(--surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--r-sm)',
      boxShadow: focus ? 'var(--ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, leading && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)',
      display: 'inline-flex'
    }
  }, leading), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus?.(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur?.(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: 15,
      color: 'var(--ink)',
      letterSpacing: '-0.005em'
    }
  }, rest)), trailing && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)',
      display: 'inline-flex'
    }
  }, trailing)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--alert)' : 'var(--text-faint)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan Tag — a category / keyword chip. Distinct from Badge (status):
 * Tags label content and can be removable or selectable (filters).
 */
function Tag({
  tone = 'neutral',
  selected = false,
  onRemove = null,
  leading = null,
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--paper-2)',
      fg: 'var(--ink)',
      bd: 'var(--border)'
    },
    gold: {
      bg: 'var(--gold-wash)',
      fg: 'var(--gold-deep)',
      bd: 'var(--gold-line)'
    },
    outline: {
      bg: 'transparent',
      fg: 'var(--muted-2)',
      bd: 'var(--border-strong)'
    }
  };
  const t = selected ? {
    bg: 'var(--ink)',
    fg: 'var(--on-ink)',
    bd: 'var(--ink)'
  } : tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: onRemove ? '4px 6px 4px 10px' : '4px 11px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '-0.005em',
      lineHeight: 1.4,
      color: t.fg,
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--r-sm)',
      whiteSpace: 'nowrap',
      cursor: rest.onClick ? 'pointer' : 'default',
      ...style
    }
  }, rest), leading, children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Remove",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      marginLeft: 1,
      padding: 0,
      border: 'none',
      borderRadius: 'var(--r-xs)',
      background: 'transparent',
      color: 'currentColor',
      opacity: 0.55,
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/product/EmailCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan EmailCard — the product's central artifact. A drafted, role-specific
 * email shown with its recipient, sourced-fact highlights (<mark>), and the
 * gate verdicts that let it ship. Body is passed as children so callers can
 * inline <SourceChip/> next to claims.
 */
const STATUS = {
  draft: {
    tone: 'neutral',
    label: 'Draft'
  },
  review: {
    tone: 'gold',
    label: 'In review'
  },
  approved: {
    tone: 'gold',
    label: 'Approved'
  },
  sent: {
    tone: 'ink',
    label: 'Sent'
  },
  replied: {
    tone: 'solid',
    label: 'Replied'
  }
};
function EmailCard({
  recipient = {
    name: '',
    role: '',
    company: ''
  },
  subject = '',
  status = 'review',
  gates = [],
  interactive = false,
  style = {},
  children,
  ...rest
}) {
  const st = STATUS[status] || STATUS.review;
  const initials = (recipient.name || '').split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
  const badgeTones = {
    neutral: {
      bg: 'var(--paper-2)',
      fg: 'var(--muted-2)',
      bd: 'var(--border)'
    },
    gold: {
      bg: 'var(--gold-wash)',
      fg: 'var(--gold-deep)',
      bd: 'var(--gold-line)'
    },
    ink: {
      bg: 'var(--ink)',
      fg: 'var(--on-ink)',
      bd: 'var(--ink)'
    },
    solid: {
      bg: 'var(--gold)',
      fg: 'var(--ink)',
      bd: 'var(--gold)'
    }
  };
  const bt = badgeTones[st.tone];
  const [hover, setHover] = React.useState(false);
  const gateColor = s => s === 'fail' ? 'var(--alert)' : s === 'checking' ? 'var(--line-strong)' : 'var(--gold)';
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '14px 16px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 'var(--r-sm)',
      background: 'var(--ink)',
      color: 'var(--on-ink)',
      fontWeight: 700,
      fontSize: 14,
      flexShrink: 0
    }
  }, initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700,
      color: 'var(--ink)',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, recipient.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, recipient.role, recipient.role && recipient.company ? ' · ' : '', recipient.company)), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      padding: '3px 11px',
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.02em',
      borderRadius: 'var(--r-pill)',
      color: bt.fg,
      background: bt.bg,
      border: `1px solid ${bt.bd}`
    }
  }, st.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 6px'
    }
  }, subject && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15.5,
      fontWeight: 700,
      color: 'var(--ink)',
      letterSpacing: '-0.015em',
      marginBottom: 9
    }
  }, subject), /*#__PURE__*/React.createElement("div", {
    className: "pecan-email-body",
    style: {
      fontSize: 14.5,
      lineHeight: 1.62,
      color: 'var(--ink-3)',
      letterSpacing: '-0.005em'
    }
  }, children), /*#__PURE__*/React.createElement("style", null, `.pecan-email-body mark{background:var(--gold-wash);color:var(--ink);padding:0 3px;border-radius:3px;box-shadow:inset 0 -1px 0 var(--gold-line);}`)), gates.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      padding: '13px 16px',
      marginTop: 8,
      borderTop: '1px solid var(--border)',
      background: 'var(--paper)'
    }
  }, gates.map((g, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: g.state === 'fail' ? 'var(--alert)' : 'var(--muted-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: gateColor(g.state),
      color: g.state === 'fail' ? '#fff' : 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, g.state === 'fail' ? /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5 9 17.5 20 6.5"
  }))), g.name))));
}
Object.assign(__ds_scope, { EmailCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/EmailCard.jsx", error: String((e && e.message) || e) }); }

// components/product/EmpathyMeter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan EmpathyMeter — scores empathy / specificity against a floor.
 * Pecan reports softer qualities as measured numbers rather than promising
 * perfection. The floor marker shows the bar every email must clear.
 */
function EmpathyMeter({
  label = 'Empathy',
  value = 0,
  floor = 70,
  caption = '',
  size = 'md',
  style = {},
  ...rest
}) {
  const v = Math.max(0, Math.min(100, value));
  const below = v < floor;
  const h = size === 'sm' ? 6 : 8;
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setW(v));
    return () => cancelAnimationFrame(id);
  }, [v]);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)',
      letterSpacing: '-0.005em'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: below ? 'var(--alert)' : 'var(--gold-deep)',
      fontFeatureSettings: 'var(--num)',
      letterSpacing: '-0.01em'
    }
  }, v, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      fontWeight: 600
    }
  }, " / 100"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: h,
      borderRadius: 'var(--r-pill)',
      background: 'var(--paper-3)',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${w}%`,
      borderRadius: 'var(--r-pill)',
      background: below ? 'var(--alert)' : 'var(--gold)',
      transition: 'width 1s var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    title: `Floor ${floor}`,
    style: {
      position: 'absolute',
      top: -3,
      bottom: -3,
      left: `${floor}%`,
      width: 2,
      background: 'var(--ink)',
      opacity: 0.55,
      borderRadius: 1
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-faint)'
    }
  }, caption), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      fontWeight: 600
    }
  }, "floor ", floor)));
}
Object.assign(__ds_scope, { EmpathyMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/EmpathyMeter.jsx", error: String((e && e.message) || e) }); }

// components/product/GateStatus.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan GateStatus — the deterministic guarantee made visible. Each gate
 * (Truth, Voice, Empathy) either passes or fails closed. Pass = gold,
 * fail = alert, checking = neutral pulse. Compose three for a full email.
 */
function GateStatus({
  name = 'Gate',
  state = 'pass',
  detail = '',
  variant = 'row',
  style = {},
  ...rest
}) {
  const map = {
    pass: {
      fg: 'var(--gold-deep)',
      bg: 'var(--gold-wash)',
      bd: 'var(--gold-line)',
      tile: 'var(--gold)',
      tileFg: 'var(--ink)',
      word: 'Passed'
    },
    fail: {
      fg: 'var(--alert)',
      bg: 'var(--alert-wash)',
      bd: 'rgba(155,58,52,0.35)',
      tile: 'var(--alert)',
      tileFg: '#fff',
      word: 'Blocked'
    },
    checking: {
      fg: 'var(--muted-2)',
      bg: 'var(--paper-2)',
      bd: 'var(--border)',
      tile: 'var(--line-strong)',
      tileFg: 'var(--ink)',
      word: 'Checking'
    }
  };
  const m = map[state] || map.pass;
  const Icon = () => /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: m.tileFg,
    strokeWidth: "2.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, state === 'fail' ? /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  }) : state === 'checking' ? /*#__PURE__*/React.createElement("path", {
    d: "M12 6v6l4 2"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5 9 17.5 20 6.5"
  }));
  if (variant === 'chip') {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px 3px 4px',
        background: m.bg,
        border: `1px solid ${m.bd}`,
        borderRadius: 'var(--r-pill)',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 600,
        color: m.fg,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: m.tile
      }
    }, /*#__PURE__*/React.createElement(Icon, null)), name);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 13px',
      background: m.bg,
      border: `1px solid ${m.bd}`,
      borderRadius: 'var(--r-md)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: 26,
      borderRadius: 'var(--r-sm)',
      background: m.tile,
      flexShrink: 0,
      animation: state === 'checking' ? 'pecanPulse 1.4s var(--ease-in-out) infinite' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--ink)',
      letterSpacing: '-0.01em'
    }
  }, name), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 12.5,
      color: 'var(--text-muted)',
      marginTop: 1
    }
  }, detail)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: m.fg,
      flexShrink: 0
    }
  }, m.word), /*#__PURE__*/React.createElement("style", null, `@keyframes pecanPulse{0%,100%{opacity:1}50%{opacity:.45}}`));
}
Object.assign(__ds_scope, { GateStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/GateStatus.jsx", error: String((e && e.message) || e) }); }

// components/product/SourceChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pecan SourceChip — every concrete fact carries one. Shows where a
 * claim came from and how much it's trusted. First-party sources
 * (calls, CRM, deals) rank highest and read gold; public/web read neutral.
 */
const ICONS = {
  call: 'M6.5 3h3l1.5 4-2 1.5a11 11 0 0 0 4.5 4.5L15 15l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3 5.6 1.5 1.5 0 0 1 4.5 4h2Z',
  crm: 'M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2Zm0 0v12c0 1.1 3.6 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.6 2 8 2s8-.9 8-2',
  deal: 'M3 7h7l2 2 2-2h7M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7M9 13h6',
  web: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.2 4 5.5 4 9s-1.5 6.8-4 9c-2.5-2.2-4-5.5-4-9s1.5-6.8 4-9ZM3.5 9h17M3.5 15h17',
  enrichment: 'M12 3l2.4 5.6L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-.4Z'
};
function SourceChip({
  type = 'call',
  label = '',
  trust = 'high',
  verified = true,
  size = 'md',
  style = {},
  ...rest
}) {
  const firstParty = type === 'call' || type === 'crm' || type === 'deal';
  const tones = firstParty ? {
    bg: 'var(--gold-wash)',
    fg: 'var(--gold-deep)',
    bd: 'var(--gold-line)'
  } : {
    bg: 'var(--paper-2)',
    fg: 'var(--muted-2)',
    bd: 'var(--border)'
  };
  const sm = size === 'sm';
  const ic = sm ? 12 : 13;
  return /*#__PURE__*/React.createElement("span", _extends({
    title: `${label} · ${trust} trust`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: sm ? '2px 7px' : '3px 9px',
      verticalAlign: 'middle',
      fontFamily: 'var(--font-sans)',
      fontSize: sm ? 11.5 : 12.5,
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.3,
      color: tones.fg,
      background: tones.bg,
      border: `1px solid ${tones.bd}`,
      borderRadius: 'var(--r-sm)',
      whiteSpace: 'nowrap',
      cursor: 'default',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: ic,
    height: ic,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      opacity: 0.85
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: ICONS[type] || ICONS.web
  })), label, verified && /*#__PURE__*/React.createElement("svg", {
    width: ic,
    height: ic,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5 9 17.5 20 6.5"
  })));
}
Object.assign(__ds_scope, { SourceChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/SourceChip.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.EmailCard = __ds_scope.EmailCard;

__ds_ns.EmpathyMeter = __ds_scope.EmpathyMeter;

__ds_ns.GateStatus = __ds_scope.GateStatus;

__ds_ns.SourceChip = __ds_scope.SourceChip;

})();
