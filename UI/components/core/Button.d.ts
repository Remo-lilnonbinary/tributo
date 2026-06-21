import * as React from 'react';

/**
 * Tributo's button, any action. The signal-green `primary` is the one
 * action/live accent; use at most one per view. `console` (anchor blue) is
 * for the operator surface. `pill` shape on citizen, `sharp` on console.
 *
 * @startingPoint section="Core" subtitle="Primary, secondary, ghost, console" viewport="700x150"
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet' | 'console' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'sharp';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
