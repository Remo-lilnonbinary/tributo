import * as React from 'react';

/**
 * Category / filter / quick-start chip (for statuses use Badge). `interactive`
 * renders a button with selected state, used for quick-start prompt chips and
 * filters.
 *
 * @startingPoint section="Core" subtitle="default · blue · live · selectable" viewport="700x120"
 */
export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  tone?: 'default' | 'blue' | 'live';
  interactive?: boolean;
  selected?: boolean;
  leading?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export function Tag(props: TagProps): JSX.Element;
