/**
 * ========================================
 * META API EVENTS - Facebook Conversion API
 * ========================================
 * 
 * Utilitário para envio de eventos para a API do Meta (Facebook Conversion API)
 * Baseado na estrutura do Google Tag Manager configurado
 */

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
  client_ip?: string;
  user_agent?: string;
  fbp?: string; // Facebook Browser ID (cookie)
  fbc?: string; // Facebook Click ID (parâmetro _fbp)
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
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

// ===== CONFIGURAÇÕES =====

const META_API_VERSION = "v21.0";
const META_API_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

// Variáveis de ambiente necessárias:
// - NEXT_PUBLIC_META_PIXEL_ID
// - NEXT_PUBLIC_META_ACCESS_TOKEN (ou usar servidor-side)
// - NEXT_PUBLIC_META_API_URL (opcional, para proxy servidor)

// ===== FUNÇÕES UTILITÁRIAS =====

/**
 * Gera um ID único para o evento
 */
export function generateEventId(): string {
  if (typeof window !== "undefined") {
    // Cliente: usa timestamp + random
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
  // Servidor: apenas timestamp (melhor performance)
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Extrai fbp (Facebook Browser ID) do cookie
 */
function getFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "_fbp") {
      return value;
    }
  }
  return undefined;
}

/**
 * Extrai fbc (Facebook Click ID) da URL
 */
function getFbc(): string | undefined {
  if (typeof window === "undefined") return undefined;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("_fbc") || undefined;
}

/**
 * Obtém IP do cliente (via API ou header)
 */
async function getClientIp(): Promise<string | undefined> {
  try {
    // Usa serviço externo para obter IP (apenas se necessário)
    if (typeof window !== "undefined") {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    }
  } catch {
    // Ignora erros
  }
  return undefined;
}

/**
 * Obtém dados do usuário automaticamente
 */
export async function getAutoUserData(
  formData?: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<MetaUserData> {
  const userData: MetaUserData = {};

  // Dados do formulário
  if (formData?.name) {
    const nameParts = formData.name.trim().split(" ");
    userData.first_name = nameParts[0] || undefined;
    userData.last_name = nameParts.slice(1).join(" ") || undefined;
  }

  if (formData?.email) {
    userData.email = formData.email.trim().toLowerCase();
  }

  if (formData?.phone) {
    // Remove formatação e normaliza
    userData.phone = formData.phone.replace(/\D/g, "");
    if (userData.phone && !userData.phone.startsWith("55")) {
      userData.phone = `55${userData.phone}`;
    }
  }

  if (formData?.city) {
    userData.city = formData.city.trim();
  }

  if (formData?.state) {
    userData.region = formData.state.trim();
  }

  if (formData?.zip) {
    userData.postal = formData.zip.replace(/\D/g, "");
  }

  // Dados do browser (apenas no cliente)
  if (typeof window !== "undefined") {
    userData.fbp = getFbp();
    userData.fbc = getFbc();
    userData.user_agent = navigator.userAgent;
    
    // IP (opcional - pode ser caro)
    // userData.client_ip = await getClientIp();
  }

  // País padrão (Brasil)
  userData.country = "BR";

  // Remove campos undefined
  return Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  ) as MetaUserData;
}

/**
 * Normaliza nome completo em first_name e last_name
 */
export function splitName(fullName: string): {
  first_name: string;
  last_name?: string;
} {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" ") || undefined,
  };
}

/**
 * Normaliza telefone para o formato esperado (sem formatação, com código do país)
 */
export function normalizePhoneForMeta(phone: string): string {
  // Remove tudo exceto números
  const digits = phone.replace(/\D/g, "");
  
  // Se não começa com 55 (Brasil), adiciona
  if (digits && !digits.startsWith("55")) {
    return `55${digits}`;
  }
  
  return digits;
}

// ===== ENVIO DE EVENTOS =====

/**
 * Envia evento para a API do Meta (cliente-side)
 * Nota: Para produção, recomenda-se usar servidor-side
 */
export async function sendMetaEventClient(
  event: MetaEvent
): Promise<MetaApiResponse | null> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn(
      "[Meta Events] Pixel ID ou Access Token não configurados"
    );
    return null;
  }

  // Verifica consentimento de cookies
  if (typeof window !== "undefined") {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "accepted") {
      console.warn("[Meta Events] Consentimento de cookies não aceito");
      return null;
    }
  }

  const eventId = event.eventId || generateEventId();
  const eventTime = event.eventTime || Math.floor(Date.now() / 1000);

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_id: eventId,
        event_time: eventTime,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
        user_data: event.userData || {},
        custom_data: event.customData || {},
      },
    ],
    access_token: accessToken,
  };

  try {
    const response = await fetch(
      `${META_API_BASE_URL}/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data: MetaApiResponse = await response.json();

    if (!response.ok) {
      console.error("[Meta Events] Erro ao enviar evento:", data);
      return data;
    }

    return data;
  } catch (error) {
    console.error("[Meta Events] Erro ao enviar evento:", error);
    return null;
  }
}

/**
 * Envia evento para a API do Meta (servidor-side)
 * Recomendado para produção por segurança
 */
export async function sendMetaEventServer(
  event: MetaEvent
): Promise<MetaApiResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_META_API_URL;

  if (!apiUrl) {
    console.warn(
      "[Meta Events] NEXT_PUBLIC_META_API_URL não configurado. Use proxy servidor."
    );
    return null;
  }

  const eventId = event.eventId || generateEventId();
  const eventTime = event.eventTime || Math.floor(Date.now() / 1000);

  const payload = {
    event_name: event.eventName,
    event_id: eventId,
    event_time: eventTime,
    event_source_url: event.customData?.source_url,
    action_source: "website",
    user_data: event.userData || {},
    custom_data: event.customData || {},
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: MetaApiResponse = await response.json();

    if (!response.ok) {
      console.error("[Meta Events] Erro ao enviar evento:", data);
      return data;
    }

    return data;
  } catch (error) {
    console.error("[Meta Events] Erro ao enviar evento:", error);
    return null;
  }
}

/**
 * Envia evento (wrapper que escolhe cliente ou servidor)
 */
export async function sendMetaEvent(
  event: MetaEvent,
  useServer: boolean = false
): Promise<MetaApiResponse | null> {
  if (useServer || typeof window === "undefined") {
    return sendMetaEventServer(event);
  }
  return sendMetaEventClient(event);
}

// ===== HELPERS PARA EVENTOS ESPECÍFICOS =====

/**
 * Envia evento de Lead
 */
export async function trackLead(data: {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  courseName?: string;
  externalId?: string;
}): Promise<void> {
  const userData = await getAutoUserData({
    name: data.name,
    email: data.email,
    phone: data.phone,
    city: data.city,
    state: data.state,
    zip: data.zip,
  });

  if (data.externalId) {
    userData.external_id = data.externalId;
  }

  await sendMetaEvent({
    eventName: "Lead",
    userData,
    customData: {
      course_name: data.courseName,
      content_name: data.courseName,
    },
  });
}

/**
 * Envia evento de CompleteRegistration (sucesso no envio do formulário)
 */
export async function trackCompleteRegistration(data: {
  name?: string;
  email?: string;
  phone?: string;
  courseName?: string;
  externalId?: string;
}): Promise<void> {
  const userData = await getAutoUserData({
    name: data.name,
    email: data.email,
    phone: data.phone,
  });

  if (data.externalId) {
    userData.external_id = data.externalId;
  }

  await sendMetaEvent({
    eventName: "CompleteRegistration",
    userData,
    customData: {
      course_name: data.courseName,
      content_name: data.courseName,
      status: "completed",
    },
  });
}

/**
 * Envia evento de InitiateCheckout (quando abre modal/formulário)
 */
export async function trackInitiateCheckout(courseName?: string): Promise<void> {
  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "InitiateCheckout",
    userData,
    customData: {
      course_name: courseName,
      content_name: courseName,
    },
  });
}

/**
 * Envia evento de PageView
 */
export async function trackPageView(path?: string): Promise<void> {
  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "PageView",
    userData,
    customData: {
      page_path: path || (typeof window !== "undefined" ? window.location.pathname : ""),
      page_url: typeof window !== "undefined" ? window.location.href : "",
    },
  });
}

/**
 * Envia evento de ViewContent (visualização de página de curso)
 */
export async function trackViewContent(courseName: string): Promise<void> {
  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "ViewContent",
    userData,
    customData: {
      content_name: courseName,
      content_category: "curso",
      content_type: "curso_tecnico",
    },
  });
}

/**
 * Envia evento de Scroll (25%, 50%, 75%, 100%)
 */
export async function trackScroll(percentage: 25 | 50 | 75 | 100): Promise<void> {
  // Evita duplicação
  const key = `scroll_${percentage}`;
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "true");
  }

  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "Scroll",
    userData,
    customData: {
      scroll_percentage: percentage,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    },
  });
}

/**
 * Envia evento de abertura de modal
 */
export async function trackModalOpen(modalType: string, courseName?: string): Promise<void> {
  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "ModalOpen",
    userData,
    customData: {
      modal_type: modalType,
      course_name: courseName,
    },
  });
}

/**
 * Envia evento de fechamento de modal
 */
export async function trackModalClose(modalType: string): Promise<void> {
  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "ModalClose",
    userData,
    customData: {
      modal_type: modalType,
    },
  });
}

/**
 * Envia evento de preenchimento de campo do formulário
 */
export async function trackFormField(fieldName: string, hasValue: boolean): Promise<void> {
  // Throttle: máximo 1 evento por campo por sessão
  const key = `formfield_${fieldName}`;
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "true");
  }

  const userData = await getAutoUserData();

  await sendMetaEvent({
    eventName: "FormField",
    userData,
    customData: {
      field_name: fieldName,
      has_value: hasValue,
    },
  });
}

