// lib/analytics.ts
export const trackPageView = (): void => {
  try {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
      console.log("[Meta Events] PageView enviado com sucesso");
    }
  } catch (err) {
    console.error("[Meta Events] Erro ao enviar PageView:", err);
  }
};

// Evento customizado
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  try {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", eventName, params);
      console.log(`[Meta Events] Evento '${eventName}' enviado`);
    }
  } catch (err) {
    console.error(`[Meta Events] Erro ao enviar evento '${eventName}':`, err);
  }
};
