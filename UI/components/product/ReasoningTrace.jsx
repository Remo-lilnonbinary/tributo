import React from 'react';

/**
 * Tributo ReasoningTrace, the live reasoning panel. On the `plan` event the
 * planner's sub-questions appear; on each `retrieval` event a step animates in
 * with a coverage % and source/fact counts. Shows which planner produced each
 * sub-question. Honest, legible, never a "magic" black box.
 */
export function ReasoningTrace({
  steps = [],   // [{ planner, question, coverage, sources, facts, state }]
  title = 'How I worked this out',
  style = {},
  ...rest
}) {
  const stateStyles = {
    pending: { dot: 'var(--line-strong)', op: 0.55 },
    active:  { dot: 'var(--signal-glow)', op: 1 },
    done:    { dot: 'var(--confidence-grounded)', op: 1 },
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', ...style }} {...rest}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{title}</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
      )}
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => {
          const st = stateStyles[s.state || 'pending'];
          const last = i === steps.length - 1;
          return (
            <li key={i} style={{
              display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12,
              animation: 'tributo-rise var(--dur-3) var(--ease-out) both',
              animationDelay: `${i * 70}ms`,
            }}>
              {/* rail */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{
                  width: 13, height: 13, borderRadius: '50%', background: st.dot, marginTop: 3, flex: '0 0 auto',
                  boxShadow: s.state === 'active' ? '0 0 0 4px rgba(34,194,129,0.22)' : 'none',
                  animation: s.state === 'active' ? 'tributo-pulse-glow 1.8s ease-out infinite' : 'none',
                }} />
                {!last && <span style={{ width: 2, flex: 1, background: 'var(--line)', marginTop: 4, minHeight: 18 }} />}
              </div>
              {/* body */}
              <div style={{ paddingBottom: last ? 0 : 18, opacity: st.op }}>
                {s.planner && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: 'var(--blue-700)',
                    background: 'var(--blue-50)', borderRadius: 5, padding: '1px 7px', letterSpacing: '0.02em',
                  }}>{s.planner}</span>
                )}
                <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, margin: '7px 0 0' }}>{s.question}</div>
                {(s.coverage != null || s.sources != null || s.facts != null) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                    {s.coverage != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 64, height: 6, background: 'var(--paper-3)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${s.coverage}%`, height: '100%', background: 'var(--confidence-grounded)',
                            transition: 'width var(--dur-4) var(--ease-out)' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>{s.coverage}% coverage</span>
                      </div>
                    )}
                    {s.sources != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{s.sources} sources</span>}
                    {s.facts != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{s.facts} facts</span>}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
