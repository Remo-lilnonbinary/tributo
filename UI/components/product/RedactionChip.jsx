import React from 'react';

/**
 * Tributo RedactionChip, one piece of PII that was removed before anything
 * left the device. Distinct calm "redaction" plum, mono token. Populates the
 * Privacy tab on the `redaction` SSE event.
 */
export function RedactionChip({
  type = 'NAME',     // NAME | ADDRESS | UTR | NINO | EMAIL | PHONE | DOB | ACCOUNT
  token,             // masked replacement, e.g. "[NAME]" or "•••• 4291"
  count = 1,
  style = {},
  ...rest
}) {
  const labels = {
    NAME: 'Name', ADDRESS: 'Address', UTR: 'UTR', NINO: 'NI number',
    EMAIL: 'Email', PHONE: 'Phone', DOB: 'Date of birth', ACCOUNT: 'Account no.',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'var(--redaction-bg)', border: '1px solid rgba(91,83,166,0.22)',
      borderRadius: 'var(--radius-sm)', padding: '5px 10px',
      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--redaction)', ...style,
    }} {...rest}>
      <span aria-hidden="true" style={{
        width: 18, height: 18, borderRadius: 5, background: 'var(--redaction)', color: 'var(--redaction-bg)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </span>
      <span style={{ fontWeight: 600 }}>{labels[type] || type}</span>
      {token && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.85,
          background: 'rgba(91,83,166,0.12)', padding: '1px 6px', borderRadius: 4 }}>{token}</span>
      )}
      {count > 1 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>×{count}</span>}
    </span>
  );
}
