export type EventName = 
  | "page_view"
  | "scroll_depth"
  | "cta_click"
  | "outbound_click"
  | "calculator_interaction"
  | "faq_toggle"
  | "form_view"
  | "form_start"
  | "form_step_view"
  | "form_step_complete"
  | "form_validation_error"
  | "prequalification_complete"
  | "prequalification_disqualified"
  | "form_submit_attempt"
  | "generate_lead"
  | "form_submit_error"
  | "thank_you_view";

export interface BaseEventParams {
  page_type?: string;
  page_slug?: string;
  page_path?: string;
  page_title?: string;
  page_location?: string;
  campaign_id?: string;
  landing_id?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ScrollDepthParams extends BaseEventParams {
  percent_scrolled: number;
}

export interface CtaClickParams extends BaseEventParams {
  cta_id: string;
  placement: string;
  cta_text?: string;
  destination?: string;
}

export interface OutboundClickParams extends BaseEventParams {
  url: string;
  outbound_type: "app_store" | "google_play" | "social" | "external";
  network?: string;
}

export interface CalculatorParams extends BaseEventParams {
  amount: number;
  months: number;
  discount_percent: number;
  estimated_settlement: number;
  monthly_savings: number;
  action_type: "amount_change" | "term_change" | "preset_chip" | "submit_with_amount";
}

export interface FaqToggleParams extends BaseEventParams {
  question: string;
  is_open: boolean;
  index: number;
}

export interface FormEventParams extends BaseEventParams {
  form_id: string;
  form_version?: string;
  step_id?: string;
  step_number?: number;
  debt_range?: string;
  entity_type?: string;
}

export type EventParamsMap = {
  page_view: BaseEventParams;
  scroll_depth: ScrollDepthParams;
  cta_click: CtaClickParams;
  outbound_click: OutboundClickParams;
  calculator_interaction: CalculatorParams;
  faq_toggle: FaqToggleParams;
  form_view: FormEventParams;
  form_start: FormEventParams;
  form_step_view: FormEventParams;
  form_step_complete: FormEventParams;
  form_validation_error: FormEventParams & { error_message: string };
  prequalification_complete: FormEventParams;
  prequalification_disqualified: FormEventParams;
  form_submit_attempt: FormEventParams;
  generate_lead: FormEventParams;
  form_submit_error: FormEventParams & { error_message: string };
  thank_you_view: BaseEventParams;
};
