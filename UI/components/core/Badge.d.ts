import * as React from 'react';

/**
 * Short status pill. Semantic tones carry system meaning: `grounded`,
 * `escalated`, `redaction`, plus `neutral|info|alert|live`. `live` pulses
 * (signal glow) for active states.
 *
 * @startingPoint section="Core" subtitle="grounded · escalated · redaction · live" viewport="700x120"
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'grounded' | 'escalated' | 'redaction' | 'info' | 'alert' | 'live';
  dot?: boolean;
  size?: 'sm' | 'md';
}

export function Badge(props: BadgeProps): JSX.Element;
