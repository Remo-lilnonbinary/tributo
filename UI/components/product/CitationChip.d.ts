import * as React from 'react';

/**
 * Pins provenance to the answer. `source` = a consolidated citation to a
 * document (GOV.UK/HMRC/legislation/corpus) that links out; `fact` = an exact
 * figure traceable to a source, shown in mono. Every specific in an answer is
 * one of these, Tributo never states an unsourced figure.
 *
 * @startingPoint section="Advisor" subtitle="Source citations + fact chips" viewport="700x140"
 */
export interface CitationChipProps extends React.HTMLAttributes<HTMLElement> {
  kind?: 'source' | 'fact';
  provenance?: 'govuk' | 'hmrc' | 'legislation' | 'corpus';
  label?: string;
  value?: React.ReactNode;
  sourceRef?: string;
  href?: string;
  index?: number;
}

export function CitationChip(props: CitationChipProps): JSX.Element;
