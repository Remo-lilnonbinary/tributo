import * as React from 'react';

/**
 * The citizen surface's centrepiece: a friendly animated tax advisor whose
 * `mode` is driven by backend SSE events (redaction→plan→retrieval→meta→
 * actions→token→done). Carries an always-on aria-live text equivalent and
 * collapses to instant cross-fades under prefers-reduced-motion.
 *
 * @startingPoint section="Advisor" subtitle="Animated character, all backend states" viewport="700x300"
 */
export interface AdvisorAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: 'idle' | 'listening' | 'shielding' | 'thinking' | 'researching'
       | 'consolidating' | 'handingOver' | 'handoff' | 'speaking' | 'done' | 'error';
  size?: number;        // width/height in px (square)
  talkLevel?: number;   // 0..1 mouth openness during `speaking`
  status?: string;      // override the aria-live status text
}

export function AdvisorAvatar(props: AdvisorAvatarProps): JSX.Element;
