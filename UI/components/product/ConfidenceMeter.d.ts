import * as React from 'react';

/**
 * Reports the answer's groundedness as a number against a floor every answer
 * must clear. At/above floor = grounded (green); below = escalated to a human
 * (amber). A visible floor marker sits on the track.
 *
 * @startingPoint section="Advisor" subtitle="Grounded vs escalated, with floor" viewport="700x130"
 */
export interface ConfidenceMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;   // 0..100
  floor?: number;
  label?: string;
  caption?: string;
  size?: 'sm' | 'md';
}

export function ConfidenceMeter(props: ConfidenceMeterProps): JSX.Element;
