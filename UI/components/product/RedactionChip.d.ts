import * as React from 'react';

/**
 * One piece of PII removed before anything left the device. Distinct calm
 * "redaction" plum with a mono token. Populates the Privacy tab on the
 * `redaction` SSE event.
 *
 * @startingPoint section="Advisor" subtitle="What PII was scrubbed" viewport="700x110"
 */
export interface RedactionChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: 'NAME' | 'ADDRESS' | 'UTR' | 'NINO' | 'EMAIL' | 'PHONE' | 'DOB' | 'ACCOUNT';
  token?: string;
  count?: number;
}

export function RedactionChip(props: RedactionChipProps): JSX.Element;
