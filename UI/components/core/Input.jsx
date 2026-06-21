import React from 'react';

/**
 * Tributo Input, labelled text field. GOV.UK-grade: large hit area, visible
 * label above (never placeholder-only), hint + error with room to breathe,
 * a 2px focus that pairs with the global yellow focus block.
 */
export function Input({
  label,
  hint,
  error,
  id,
  value,
  defaultValue,
  placeholder,
  type = 'text',
  prefix = null,
  suffix = null,
  disabled = false,
  shape = 'pill',          // pill (citizen) | sharp (console)
  onChange,
  style = {},
  inputStyle = {},
  ...rest
}) {
  const reactId = React.useId();
  const fid = id || reactId;
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  const [focused, setFocused] = React.useState(false);

  const radius = shape === 'sharp' ? 'var(--radius-console)' : 'var(--radius-md)';
  const borderColor = error ? 'var(--alert)' : focused ? 'var(--blue-500)' : 'var(--line-strong)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style }}>
      {label && (
        <label htmlFor={fid} style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
          {label}
        </label>
      )}
      {hint && (
        <span id={hintId} style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.4 }}>{hint}</span>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: disabled ? 'var(--paper-2)' : 'var(--white)',
        border: `2px solid ${borderColor}`,
        borderRadius: radius,
        padding: '0 14px',
        boxShadow: focused ? '0 0 0 3px rgba(31,94,196,0.18)' : 'none',
        transition: 'border-color var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out)',
      }}>
        {prefix && <span aria-hidden="true" style={{ color: 'var(--ink-3)', display: 'inline-flex' }}>{prefix}</span>}
        <input
          id={fid}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={[hintId, errId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          style={{
            flex: 1, border: 0, outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--ink)',
            padding: '13px 0', minWidth: 0, ...inputStyle,
          }}
          {...rest}
        />
        {suffix && <span aria-hidden="true" style={{ color: 'var(--ink-3)', display: 'inline-flex' }}>{suffix}</span>}
      </div>
      {error && (
        <span id={errId} role="alert" style={{ fontSize: 14, fontWeight: 600, color: 'var(--alert)', lineHeight: 1.4 }}>
          {error}
        </span>
      )}
    </div>
  );
}
