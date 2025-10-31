/**
 * Hook para facilitar o uso do tracking do Meta
 */

import { useEffect, useCallback } from "react";
import {
  trackPageView,
  trackLead,
  trackCompleteRegistration,
  trackInitiateCheckout,
  trackViewContent,
  trackScroll,
  trackFormField,
  trackModalOpen,
  trackModalClose,
} from "./metaEvents";

/**
 * Tipo para as porcentagens de scroll
 */
type ScrollMilestone = 25 | 50 | 75 | 100;

/**
 * Hook para tracking de scroll (25%, 50%, 75%, 100%)
 */
export function useScrollTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tracked: Set<ScrollMilestone> = new Set();

    const handleScroll = () => {
      const { scrollTop, scrollHeight } = document.documentElement;
      const windowHeight = window.innerHeight;
      const percent = Math.min(
        Math.round(((scrollTop + windowHeight) / scrollHeight) * 100),
        100
      ) as ScrollMilestone | number;

      const milestones: ScrollMilestone[] = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (percent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          trackScroll(milestone);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
 * Funções de tracking expostas para uso global
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
