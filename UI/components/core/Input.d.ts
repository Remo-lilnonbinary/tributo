import * as React from 'react';

/**
 * Labelled text field, visible label above (never placeholder-only), hint +
 * error states, large hit area, accessible focus. `pill` (citizen) / `sharp`
 * (console).
 *
 * @startingPoint section="Core" subtitle="Label, hint, error, prefix/suffix" viewport="700x180"
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  shape?: 'pill' | 'sharp';
  inputStyle?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
