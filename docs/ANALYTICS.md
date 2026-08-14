# Analytics & Attribution

## Event Taxonomy
We use a structured, type-safe event taxonomy to track user behavior consistently.

**Allowed Events:**
- `page_view`
- `cta_click`
- `form_view`
- `form_start`
- `form_step_view`
- `form_step_complete`
- `form_validation_error`
- `prequalification_complete`
- `form_submit_attempt`
- `generate_lead`
- `form_submit_error`
- `thank_you_view`

## Implementation
All tracking is handled via `trackEvent` in `src/lib/analytics/track.ts`.
Events are pushed to `window.dataLayer`. This acts as an abstraction layer for GTM or other tag managers.

## PII Safety Rules
No Personally Identifiable Information (PII) is allowed in analytics payloads. 
The `trackEvent` function includes a basic guard against keys like `email`, `phone`, `rfc`, `nombre`.

## Attribution Capture
UTM parameters and click IDs (`gclid`, `wbraid`) are captured upon entry via `src/lib/attribution/capture.ts`.
- Stored in `sessionStorage` under `bravo_first_touch` and `bravo_last_touch`.
- Will be attached to the final lead payload sent to the backend.
