import * as React from 'react';

export interface ReasoningStep {
  planner?: string;        // which planner produced this sub-question
  question: string;
  coverage?: number;       // 0..100
  sources?: number;
  facts?: number;
  state?: 'pending' | 'active' | 'done';
}

/**
 * The live reasoning panel. Sub-questions appear on `plan`; each `retrieval`
 * event fills in coverage % and source/fact counts. Shows the planner behind
 * each step, transparent, never a black box.
 *
 * @startingPoint section="Advisor" subtitle="Planner sub-questions + retrieval coverage" viewport="700x340"
 */
export interface ReasoningTraceProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: ReasoningStep[];
  title?: string;
}

export function ReasoningTrace(props: ReasoningTraceProps): JSX.Element;
