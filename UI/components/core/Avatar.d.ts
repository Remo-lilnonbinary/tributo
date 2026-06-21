import * as React from 'react';

/**
 * Initials/icon avatar. `advisor` = signal-green system presence, `human` =
 * caseworker (blue), `citizen` = the user (ink/paper).
 *
 * @startingPoint section="Core" subtitle="citizen · human · advisor" viewport="700x100"
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  tone?: 'citizen' | 'human' | 'advisor';
  size?: number;
  src?: string | null;
  icon?: React.ReactNode;
}

export function Avatar(props: AvatarProps): JSX.Element;
