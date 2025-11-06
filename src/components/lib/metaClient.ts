"use client"; 

import { useEffect, useCallback } from "react";
import {
  trackPageView,
  trackScroll,
  trackFormField,
  trackModalOpen,
  trackModalClose,
  trackLead,
  trackCompleteRegistration,

  trackViewContent,
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
          // 👈 ALTERADO: Envia os dados do navegador para a função do servidor
          const data = getClientBrowserData();
          trackScroll(milestone, data.event_source_url, data.user_agent);
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
      // 👈 ALTERADO: Envia os dados do navegador para a função do servidor
      const data = getClientBrowserData();
      trackFormField(fieldName, hasValue, data.event_source_url, data.user_agent);
    }
  }, []);

  return { trackField };
}

// --- NOVOS HELPERS (Melhores Práticas) ---

function getFbp(): string | undefined {
  if (typeof document === "undefined") return;
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : undefined;
}

function getFbc(): string | undefined {
  if (typeof window === "undefined") return;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("_fbc") || undefined;
}

function getEventSourceUrl(): string | undefined {
  if (typeof window === "undefined") return;
  return window.location.href;
}

function getUserAgent(): string | undefined {
  if (typeof navigator === "undefined") return;
  return navigator.userAgent;
}

/**
 * 👈 NOVO: Coleta todos os dados do navegador necessários para o CAPI.
 */
export function getClientBrowserData() {
  return {
    fbp: getFbp(),
    fbc: getFbc(),
    event_source_url: getEventSourceUrl(),
    user_agent: getUserAgent(),
  };
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