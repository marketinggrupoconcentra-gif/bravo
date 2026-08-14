# Architecture: Bravo México Web Foundation

## Route Groups
We use Next.js App Router route groups to separate layouts and concerns without affecting the URL structure:
- `(seo)`: Contains the main website (Home, Soluciones, etc.) with the `SeoHeader` and full footer. Pages are indexed by default.
- `(performance)`: Contains landing pages (`/lp/[slug]`) for paid media. Uses `PerformanceHeader` (minimal distractions). Pages are `noindex` by default.

## Forms & Lead Generation
The main prequalification form is located at `/formulario`. 
- State is managed locally within the `MultiStepForm` component to provide immediate feedback.
- It is a 4-step process designed to minimize friction.

## Data Boundary
**SECURITY RULE:** The public website must NEVER request highly sensitive PII such as: RFC, CURP, date of birth, full address, credit card numbers, or bank credentials.

**Future Flow:**
1. Website captures minimal lead info (Amount, Debt Type, Name, Phone, Email).
2. Lead is sent to the secure database (Neon).
3. The internal Intelix API processes the lead.
4. An Advisor contacts the user to gather additional information.
5. Authorization is explicitly requested before any Credit Bureau consultation.

## Future Integrations (Pending)
- **Database:** Neon database connection will be added for persisting leads.
- **Intelix API:** Will handle core business logic and advisor routing.
- **Analytics:** Server-side or robust client-side dispatch (e.g., GA4 Measurement Protocol).
