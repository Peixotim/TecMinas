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
 * Gera hash SHA256 de uma string
 * A API do Meta requer que email e telefone sejam hasheados
 */
async function hashSHA256(value: string): Promise<string> {
  if (typeof window === "undefined") {
    // Servidor-side: usa crypto nativo do Node.js
    const crypto = await import("crypto");
    return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
  }
  
  // Cliente-side: usa Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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
 * Converte nosso formato de userData para o esperado pela Meta Conversions API
 */
async function convertUserDataToMeta(userData: MetaUserData): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};

  // Já enviamos email/phone hasheados em getAutoUserData
  if (userData.email) out.em = userData.email; // SHA256
  if (userData.phone) out.ph = userData.phone; // SHA256

  // Nomes/cidade/estado/CEP: se vierem, hashear agora
  if (userData.first_name) out.fn = await hashSHA256(userData.first_name);
  if (userData.last_name) out.ln = await hashSHA256(userData.last_name);
  if (userData.city) out.ct = await hashSHA256(userData.city);
  if (userData.region) out.st = await hashSHA256(userData.region);
  if (userData.postal) out.zp = await hashSHA256(userData.postal);

  if (userData.country) out.country = String(userData.country).toLowerCase();
  if (userData.external_id) out.external_id = userData.external_id; // já hash

  if (userData.client_ip) out.client_ip_address = userData.client_ip;
  if (userData.user_agent) out.client_user_agent = userData.user_agent;
  if (userData.fbp) out.fbp = userData.fbp;
  if (userData.fbc) out.fbc = userData.fbc;

  return out;
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
 * Nota: Função disponível para uso futuro se necessário
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * Email e telefone são hasheados (SHA256) conforme requerido pela API do Meta
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

  // Email deve ser hasheado (SHA256)
  if (formData?.email) {
    const emailNormalized = formData.email.trim().toLowerCase();
    userData.email = await hashSHA256(emailNormalized);
  }

  // Telefone deve ser hasheado (SHA256) - apenas dígitos
  if (formData?.phone) {
    // Remove formatação e normaliza
    let phoneNormalized = formData.phone.replace(/\D/g, "");
    if (phoneNormalized && !phoneNormalized.startsWith("55")) {
      phoneNormalized = `55${phoneNormalized}`;
    }
    if (phoneNormalized) {
      userData.phone = await hashSHA256(phoneNormalized);
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
    Object.entries(userData).filter(([, v]) => v !== undefined)
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
 * Verifica se o Meta Events está configurado e habilitado
 */
function isMetaEventsEnabled(): boolean {
  const pixelIdRaw = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pixelId = pixelIdRaw?.match(/\d+/)?.[0];
  const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;
  
  // Verifica se há configuração válida
  if (!pixelId || !accessToken) {
    return false;
  }

  // Verifica consentimento de cookies (apenas no cliente)
  if (typeof window !== "undefined") {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "accepted") {
      return false;
    }
  }

  return true;
}

/**
 * Envia evento para a API do Meta (cliente-side)
 * Nota: Para produção, recomenda-se usar servidor-side
 */
export async function sendMetaEventClient(
  event: MetaEvent
): Promise<MetaApiResponse | null> {
  // Validação prévia: retorna silenciosamente se não estiver configurado
  if (!isMetaEventsEnabled()) {
    return null;
  }

  const pixelIdRaw = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  // Sanitiza Pixel ID: deve conter apenas dígitos
  const pixelId = pixelIdRaw?.match(/\d+/)?.[0];
  const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;
  const testEventCode = process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE;

  // Validação dupla para garantir
  if (!pixelId || !accessToken) {
    return null;
  }

  const eventId = event.eventId || generateEventId();
  const eventTime = event.eventTime || Math.floor(Date.now() / 1000);

  // Converte e limpa user_data para o formato da Meta
  const convertedUserData = event.userData ? await convertUserDataToMeta(event.userData) : {};
  const cleanUserData = Object.fromEntries(
    Object.entries(convertedUserData).filter(([, v]) => v !== undefined && v !== "")
  );

  // Remove campos undefined do custom_data
  const cleanCustomData = event.customData
    ? Object.fromEntries(
        Object.entries(event.customData).filter(([, v]) => v !== undefined && v !== "")
      )
    : {};

  // Constrói o payload do evento
  const eventPayload: Record<string, unknown> = {
    event_name: event.eventName,
    event_id: eventId,
    event_time: eventTime,
    action_source: "website",
  };

  // Adiciona event_source_url apenas se disponível
  if (typeof window !== "undefined" && window.location.href) {
    eventPayload.event_source_url = window.location.href;
  }

  // Garante pelo menos um identificador (Meta requer fbp, fbc ou client_user_agent)
  if (typeof window !== "undefined") {
    if (!cleanUserData.fbp && !cleanUserData.fbc) {
      cleanUserData.client_user_agent = cleanUserData.client_user_agent || navigator.userAgent;
    }
  }

  // Valida se há pelo menos algum dado de identificação
  const hasIdentifier = cleanUserData.fbp || cleanUserData.fbc || cleanUserData.client_user_agent || cleanUserData.em || cleanUserData.ph;
  
  if (!hasIdentifier && Object.keys(cleanUserData).length === 0) {
    // Sem dados de identificação, não envia evento
    return null;
  }

  // Adiciona user_data (Meta requer pelo menos um identificador)
  eventPayload.user_data = cleanUserData;

  // Adiciona custom_data apenas se houver dados
  if (Object.keys(cleanCustomData).length > 0) {
    eventPayload.custom_data = cleanCustomData;
  }

  const payload: Record<string, unknown> = {
    data: [eventPayload],
    access_token: accessToken,
  };
  // Inclui test_event_code quando fornecido (útil para depuração no Events Manager)
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

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
      // Verifica se é erro 400 (Bad Request) - geralmente configuração incorreta
      if (response.status === 400) {
        const errorMessage = data.error?.message || "Bad Request";
        // Só loga em desenvolvimento ou se não for erro de ID inválido conhecido
        const isDev = process.env.NODE_ENV === "development";
        if (isDev && !errorMessage.includes("Unsupported post request")) {
          console.warn("[Meta Events] Erro 400 - Verifique Pixel ID e Access Token:", {
            status: response.status,
            error: data.error,
            event: event.eventName,
          });
        }
      } else {
        // Outros erros (401, 403, 500, etc.) - sempre loga
        console.error("[Meta Events] Erro ao enviar evento:", {
          status: response.status,
          statusText: response.statusText,
          error: data,
          event: event.eventName,
        });
      }
      return data;
    }

    // Sucesso - apenas loga em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(`[Meta Events] ✅ Evento "${event.eventName}" enviado com sucesso`);
    }

    return data;
  } catch (error) {
    // Erro de rede ou JSON parsing - apenas loga em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.warn("[Meta Events] Erro de rede ao enviar evento:", error);
    }
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
  // Verifica se está habilitado antes de tentar enviar
  if (!isMetaEventsEnabled() && !useServer) {
    return null;
  }

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

  // External ID deve ser hasheado se fornecido
  if (data.externalId) {
    userData.external_id = await hashSHA256(data.externalId);
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

  // External ID deve ser hasheado se fornecido
  if (data.externalId) {
    userData.external_id = await hashSHA256(data.externalId);
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

