const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type SubscriptionData = {
  fullerName: string;
  phone: string;
  areaOfInterest: string;
  enterpriseId: number;
};

export async function refreshToken(): Promise<string> {
  try {
    if (!API_BASE_URL || !process.env.NEXT_PUBLIC_CLIENT_ID || !process.env.NEXT_PUBLIC_CLIENT_SECRET) {
      throw new Error("Variáveis de ambiente da API não configuradas. Verifique o .env.local");
    }
    const response = await fetch(`${API_BASE_URL}/trocarRota`, { // Verifique a rota do token
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao gerar token de acesso.");
    }
    const data = await response.json();
    localStorage.setItem("apiToken", data.token);
    localStorage.setItem("tokenExpiry", (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
    return data.token;
  } catch (error) {
    console.error("Erro em refreshToken:", error);
    throw error;
  }
}

// Retorna token válido
export async function getToken(): Promise<string> {
  try {
    const token = localStorage.getItem("apiToken");
    const expiry = Number(localStorage.getItem("tokenExpiry") || 0);
    if (!token || Date.now() > expiry) {
      return await refreshToken();
    }
    return token;
  } catch (error) {
    console.error("Erro em getToken:", error);
    throw error;
  }
}

// Envia dados do formulário para a API
export async function submitSubscription(
  subscriptionData: SubscriptionData
): Promise<object> {
  try {
    const token = await getToken();
    const endpoint = `${API_BASE_URL}/trocarRota`; // Verifique a rota de inscrição

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao enviar inscrição.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em submitSubscription:", error);
    throw error;
  }
}