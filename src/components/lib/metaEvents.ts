"use server";
import crypto from "crypto";

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
  fbp?: string; // 👈 Aceita 'fbp' vindo do cliente
  fbc?: string; // 👈 Aceita 'fbc' vindo do cliente
}

export interface MetaEvent {
  eventName: MetaEventName;
  eventId?: string;
  eventTime?: number;
  userData?: MetaUserData;
  customData?: Record<string, unknown>;
  event_source_url?: string; // 👈 ALTERADO: Parâmetro de evento
  user_agent?: string; // 👈 ALTERADO: Parâmetro de evento
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


const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}


async function getAutoUserData(data?: Partial<MetaUserData>): Promise<Record<string, string>> {
  const base: MetaUserData = {
    ...data,
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
        event_source_url: event.event_source_url, 
        user_data: event.userData || {},
        custom_data: {
          ...event.customData,
          client_user_agent: event.user_agent 
        },
      },
    ],
  };

  console.log(
    `[Meta Events] 🚀 Enviando Evento: ${event.eventName}`,
    JSON.stringify(payload, null, 2)
  );

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


export async function trackPageView(
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "PageView",
    userData,
    event_source_url,
    user_agent,
  });
}

export async function trackLead(
  data: MetaUserData,
  customData?: Record<string, unknown>,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({
    eventName: "Lead",
    userData,
    customData,
    event_source_url,
    user_agent,
  });
}

export async function trackCompleteRegistration(
  data: MetaUserData,
  customData?: Record<string, unknown>,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({
    eventName: "CompleteRegistration",
    userData,
    customData,
    event_source_url,
    user_agent,
  });
}

export async function trackInitiateCheckout(
  data?: MetaUserData,
  customData?: Record<string, unknown>,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData(data);
  await sendMetaEvent({
    eventName: "InitiateCheckout",
    userData,
    customData,
    event_source_url,
    user_agent,
  });
}

export async function trackViewContent(
  name: string,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ViewContent",
    userData,
    customData: { content_name: name },
    event_source_url,
    user_agent,
  });
}

export async function trackScroll(
  percent: number,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "Scroll",
    userData,
    customData: { scroll_percent: percent },
    event_source_url,
    user_agent,
  });
}

export async function trackFormField(
  fieldName: string,
  hasValue: boolean,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "FormField",
    userData,
    customData: { field_name: fieldName, filled: hasValue },
    event_source_url,
    user_agent,
  });
}

export async function trackModalOpen(
  modalName?: string,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ModalOpen",
    userData,
    customData: { modal_name: modalName },
    event_source_url,
    user_agent,
  });
}

export async function trackModalClose(
  modalName?: string,
  event_source_url?: string,
  user_agent?: string
): Promise<void> {
  const userData = await getAutoUserData();
  await sendMetaEvent({
    eventName: "ModalClose",
    userData,
    customData: { modal_name: modalName },
    event_source_url,
    user_agent,
  });
}