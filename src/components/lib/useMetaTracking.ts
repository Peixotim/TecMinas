import { useEffect, useCallback } from "react";
import {
  trackPageView,
  trackLead,
  trackCompleteRegistration,
  trackViewContent,
  trackScroll,
  trackFormField,
  trackModalOpen,
  trackModalClose,
} from "./metaEvents";


type ScrollMilestone = 25 | 50 | 75 | 100;


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


export function useFormFieldTracking() {
  const trackField = useCallback((fieldName: string, hasValue: boolean) => {
    if (hasValue) {
      trackFormField(fieldName, hasValue);
    }
  }, []);

  return { trackField };
}


export const metaTracking = {
  trackLead,
  trackCompleteRegistration,
  trackPageView,
  trackViewContent,
  trackModalOpen,
  trackModalClose,
  trackFormField,
  trackScroll,
};
