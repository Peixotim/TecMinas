/**
 * Hook para facilitar o uso do tracking do Meta
 */

import { useEffect, useCallback } from "react";
import {
  trackScroll,
  trackPageView,
  trackModalOpen,
  trackModalClose,
  trackLead,
  trackCompleteRegistration,
  trackInitiateCheckout,
  trackFormField,
  trackViewContent,
} from "./metaEvents";

/**
 * Hook para tracking de scroll
 */
export function useScrollTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollPercentagesTracked: Set<25 | 50 | 75 | 100> = new Set();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Tracka 25%, 50%, 75%, 100%
      if (scrollPercentage >= 25 && !scrollPercentagesTracked.has(25)) {
        scrollPercentagesTracked.add(25);
        trackScroll(25);
      }
      if (scrollPercentage >= 50 && !scrollPercentagesTracked.has(50)) {
        scrollPercentagesTracked.add(50);
        trackScroll(50);
      }
      if (scrollPercentage >= 75 && !scrollPercentagesTracked.has(75)) {
        scrollPercentagesTracked.add(75);
        trackScroll(75);
      }
      if (scrollPercentage >= 100 && !scrollPercentagesTracked.has(100)) {
        scrollPercentagesTracked.add(100);
        trackScroll(100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}

/**
 * Hook para tracking de preenchimento de formulário
 */
export function useFormFieldTracking() {
  const trackField = useCallback((fieldName: string, hasValue: boolean) => {
    if (hasValue) {
      trackFormField(fieldName, hasValue);
    }
  }, []);

  return { trackField };
}

/**
 * Funções de tracking expostas
 */
export const metaTracking = {
  trackLead,
  trackCompleteRegistration,
  trackInitiateCheckout,
  trackPageView,
  trackViewContent,
  trackModalOpen,
  trackModalClose,
  trackFormField,
  trackScroll,
};

