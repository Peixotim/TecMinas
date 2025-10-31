// src/services/metaEvents.ts
export type MetaEventName =
  | "PageView"
  | "Lead"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "ViewContent"
  | "Scroll"
  | "ModalOpen"
  | "ModalClose"
  | "FormField";

export interface MetaUserData {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  region?: string;
  country?: string;
  postal?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  user_agent?: string;
}

export interface MetaEvent {
  eventName: MetaEventName;
  eventId?: string;
  eventTime?: number;
  userData?: MetaUserData;
  customData?: Record<string, any>;
}

interface MetaApiResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: { message: string; type: string; code: number };
}

// ===== CONFIG =====
const META_API_VERSION = "v21.0";
const META_API_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;

// ===== FUNÇÕES AUXILIARES =====
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

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

async function getAutoUserData(data?: Partial<MetaUserData>): Promise<MetaUserData> {
  const userData: MetaUserData = {
    ...data,
    fbp: getFbp(),
    fbc: getFbc(),
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    country: "BR",
  };
  return Object.fromEntries(Object.entries(userData).filter(([_, v]) => v !== undefined)) as MetaUserData;
}

// ===== ENVIO DIRETO PARA FACEBOOK =====
export async function sendMetaEvent(event: MetaEvent): Promise<MetaApiResponse | null> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn("[Meta Events] Pixel ID ou Access Token não configurados.");
    return null;
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId || generateEventId(),
        action_source: "website",
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        user_data: event.userData || {},
        custom_data: event.customData || {},
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  try {
    const response = await fetch(`${META_API_BASE_URL}/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) console.error("[Meta Events] Erro:", data);
    return data;
  } catch (err) {
    console.error("[Meta Events] Erro de rede:", err);
    return null;
  }
}

// ===== FUNÇÕES DE TRACKING =====
export async function trackPageView(): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({ eventName: "PageView", userData });
}

export async function trackLead(data: MetaUserData): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({ eventName: "Lead", userData });
}

export async function trackCompleteRegistration(data: MetaUserData): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({ eventName: "CompleteRegistration", userData });
}

export async function trackInitiateCheckout(data?: MetaUserData): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({ eventName: "InitiateCheckout", userData });
}

export async function trackViewContent(name: string): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ViewContent",
    userData,
    customData: { content_name: name },
  });
}
