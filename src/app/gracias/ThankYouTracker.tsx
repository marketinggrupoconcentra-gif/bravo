"use client";

import React, { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";

export function ThankYouTracker() {
  useEffect(() => {
    trackEvent("thank_you_view", {
      page_type: "thank_you",
      page_title: "Solicitud Recibida | Bravo México",
    });
  }, []);

  return null;
}
