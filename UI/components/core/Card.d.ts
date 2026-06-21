import * as React from 'react';

/**
 * The base surface. Warm `paper` by default; `white`/`raised` lift on soft
 * shadow; `sunken` is a well; `console` is sharp + near-flat for the operator
 * surface; `ink` is a dark navy panel.
 *
 * @startingPoint section="Core" subtitle="paper · white · raised · console · ink" viewport="700x200"
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'paper' | 'white' | 'raised' | 'sunken' | 'console' | 'ink';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: keyof JSX.IntrinsicElements;
}

export function Card(props: CardProps): JSX.Element;
