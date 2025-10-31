// src/lib/metaEvents.ts
"use server";
import crypto from "crypto";

// ===== TIPOS =====
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
}

export interface MetaEvent {
  eventName: MetaEventName;
  eventId?: string;
  eventTime?: number;
  userData?: MetaUserData;
  customData?: Record<string, unknown>;
}

interface MetaApiResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
  };
}

// ===== CONFIG =====
const META_API_VERSION = "v21.0";
const META_API_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;

// ===== UTILS =====
function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

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

// Aplica hash em todos os campos sensíveis conforme regras do Meta
async function getAutoUserData(data?: Partial<MetaUserData>): Promise<Record<string, string>> {
  const base: MetaUserData = {
    ...data,
    fbp: getFbp(),
    fbc: getFbc(),
    country: "br",
  };

  const hashed: Record<string, string> = {};

  for (const [key, value] of Object.entries(base)) {
    if (!value) continue;
    if (["fbp", "fbc"].includes(key)) {
      hashed[key] = value;
    } else {
      hashed[key] = sha256(String(value));
    }
  }

  // Renomeia para os parâmetros aceitos pela API
  const normalized: Record<string, string> = {};
  if (hashed.email) normalized.em = hashed.email;
  if (hashed.phone) normalized.ph = hashed.phone;
  if (hashed.first_name) normalized.fn = hashed.first_name;
  if (hashed.last_name) normalized.ln = hashed.last_name;
  if (hashed.city) normalized.ct = hashed.city;
  if (hashed.region) normalized.st = hashed.region;
  if (hashed.country) normalized.country = hashed.country;
  if (hashed.postal) normalized.zp = hashed.postal;
  if (hashed.external_id) normalized.external_id = hashed.external_id;
  if (hashed.fbp) normalized.fbp = hashed.fbp;
  if (hashed.fbc) normalized.fbc = hashed.fbc;

  return normalized;
}

// ===== ENVIO =====
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
        event_source_url:
          typeof window !== "undefined" ? window.location.href : undefined,
        user_data: event.userData || {},
        custom_data: event.customData || {},
      },
    ],
  };

  try {
    const response = await fetch(
      `${META_API_BASE_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) console.error("[Meta Events] Erro:", data);
    return data;
  } catch (err) {
    console.error("[Meta Events] Erro de rede:", err);
    return null;
  }
}

// ===== EVENTOS =====
export async function trackPageView(): Promise<void> {
  const userData = await getAutoUserData();
  const customData = {
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
  await sendMetaEvent({ eventName: "PageView", userData, customData });
}

export async function trackLead(
  data: MetaUserData,
  customData?: Record<string, unknown>
): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({ eventName: "Lead", userData, customData });
}

export async function trackCompleteRegistration(
  data: MetaUserData,
  customData?: Record<string, unknown>
): Promise<void> {
  const userData = await getAutoUserData(data);
  const custom = {
    ...(customData || {}),
    event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
  };

  await sendMetaEvent({
    eventName: "CompleteRegistration",
    userData,
    customData: custom,
  });
}

export async function trackInitiateCheckout(
  data?: MetaUserData,
  customData?: Record<string, unknown>
): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({ eventName: "InitiateCheckout", userData, customData });
}

export async function trackViewContent(name: string): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ViewContent",
    userData,
    customData: { content_name: name },
  });
}

export async function trackScroll(percent: number): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "Scroll",
    userData,
    customData: { scroll_percent: percent },
  });
}

export async function trackFormField(
  fieldName: string,
  hasValue: boolean
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "FormField",
    userData,
    customData: { field_name: fieldName, filled: hasValue },
  });
}

export async function trackModalOpen(modalName?: string): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ModalOpen",
    userData,
    customData: { modal_name: modalName },
  });
}

export async function trackModalClose(modalName?: string): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ModalClose",
    userData,
    customData: { modal_name: modalName },
  });
}
