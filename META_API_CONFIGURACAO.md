# 📋 CONFIGURAÇÃO - Meta API (Facebook Conversion API)

Este documento descreve como configurar o sistema de tracking de eventos para a API do Meta (Facebook Conversion API).

---

## 🔑 Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis no seu arquivo `.env.local`:

```env
# ===== Meta/Facebook Pixel =====
# ID do Pixel do Facebook (obrigatório)
NEXT_PUBLIC_META_PIXEL_ID=seu_pixel_id_aqui

# Access Token do Facebook (para cliente-side - NÃO recomendado para produção)
# RECOMENDAÇÃO: Use servidor-side com proxy
NEXT_PUBLIC_META_ACCESS_TOKEN=seu_access_token_aqui

# URL da API de Proxy Servidor (RECOMENDADO para produção)
# Configure um endpoint no seu servidor que faça proxy para a API do Meta
NEXT_PUBLIC_META_API_URL=https://seu-dominio.com/api/meta-events

# ===== Outras Configurações Existentes =====
NEXT_PUBLIC_GTM_ID=seu_gtm_id
NEXT_PUBLIC_API_URL=sua_api_url
NEXT_PUBLIC_CLIENT_ID=seu_client_id
NEXT_PUBLIC_CLIENT_SECRET=seu_client_secret
NEXT_PUBLIC_ENTERPRISE_ID=seu_enterprise_id
```

---

## 🔐 Como Obter o Access Token

### Opção 1: Access Token do Pixel (Cliente-side) - ⚠️ NÃO RECOMENDADO

1. Acesse o [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Selecione seu Pixel
3. Vá em **Configurações** → **Conversions API**
4. Gere um **Access Token**

⚠️ **ATENÇÃO**: Não exponha o Access Token no cliente-side em produção. Use a Opção 2.

### Opção 2: Servidor-side com Proxy (RECOMENDADO) ✅

Crie um endpoint no seu servidor Next.js (`/api/meta-events/route.ts`) que faz proxy para a API do Meta:

```typescript
// app/api/meta-events/route.ts
import { NextRequest, NextResponse } from 'next/server';

const META_API_VERSION = 'v21.0';
const META_PIXEL_ID = process.env.META_PIXEL_ID!;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          access_token: META_ACCESS_TOKEN,
        }),
      }
    );

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Meta API] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar evento' },
      { status: 500 }
    );
  }
}
```

**Variáveis de ambiente no servidor (`.env.local`):**
```env
META_PIXEL_ID=seu_pixel_id
META_ACCESS_TOKEN=seu_access_token_seguro
```

---

## 📊 Eventos Implementados

### 1. PageView
- **Quando**: A cada mudança de rota
- **Onde**: `AnalyticsScripts.tsx`
- **Status**: ✅ Implementado

### 2. Lead
- **Quando**: Ao enviar formulário de inscrição
- **Onde**: `header.tsx`, `courseInformations.tsx`
- **Status**: ✅ Implementado
- **Dados enviados**: Nome, telefone, curso, external_id

### 3. CompleteRegistration
- **Quando**: Após sucesso no envio do formulário
- **Onde**: `header.tsx`, `courseInformations.tsx`
- **Status**: ✅ Implementado


### 5. ViewContent
- **Quando**: Ao visualizar página de curso
- **Onde**: `app/cursos/[slug]/page.tsx`
- **Status**: ✅ Implementado

### 6. Scroll (25%, 50%, 75%, 100%)
- **Quando**: Quando usuário faz scroll na página
- **Onde**: `AnalyticsScripts.tsx` (via `useScrollTracking`)
- **Status**: ✅ Implementado

### 7. ModalOpen
- **Quando**: Ao abrir modal de formulário
- **Onde**: `modal.tsx`
- **Status**: ✅ Implementado

### 8. ModalClose
- **Quando**: Ao fechar modal de formulário
- **Onde**: `modal.tsx`
- **Status**: ✅ Implementado

### 9. FormField
- **Quando**: Ao preencher campo do formulário (throttled)
- **Onde**: Disponível via `useFormFieldTracking`
- **Status**: ⚠️ Disponível mas não integrado automaticamente

---

## 📝 Estrutura dos Dados Enviados

### Exemplo: Evento Lead

```json
{
  "event_name": "Lead",
  "event_id": "1699123456789_abc123",
  "event_time": 1699123456,
  "event_source_url": "https://colegiotecminas.com.br/cursos/curso-slug",
  "action_source": "website",
  "user_data": {
    "email": "usuario@email.com",
    "phone": "5531973144070",
    "first_name": "João",
    "last_name": "Silva",
    "city": "Belo Horizonte",
    "region": "MG",
    "country": "BR",
    "postal": "30000-000",
    "external_id": "5531973144070",
    "fbp": "fb.1.1699123456789.AbCdEfGh",
    "fbc": "fb.1.1699123456789.AbCdEfGh",
    "client_ip": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  },
  "custom_data": {
    "course_name": "Técnico em Enfermagem",
    "content_name": "Técnico em Enfermagem"
  }
}
```

---

## 🔧 Configuração de Consentimento de Cookies

O sistema verifica o consentimento de cookies antes de enviar eventos:

```typescript
// Verifica se usuário aceitou cookies
const consent = localStorage.getItem("cookieConsent");
if (consent !== "accepted") {
  // Eventos não são enviados
}
```

**Localização do Cookie Banner**: `src/components/CookieBanner.tsx`

---

## 🚀 Como Usar

### Tracking Básico

```typescript
import { trackLead, trackPageView } from '@/components/lib/metaEvents';

// Enviar evento Lead
await trackLead({
  name: "João Silva",
  phone: "(31) 97314-4070",
  courseName: "Técnico em Enfermagem",
  externalId: "5531973144070",
});

// Enviar PageView
await trackPageView("/cursos/enfermagem");
```

### Tracking com Hook

```typescript
import { useScrollTracking } from '@/components/lib/useMetaTracking';

function MyComponent() {
  // Adiciona tracking automático de scroll
  useScrollTracking();
  
  return <div>...</div>;
}
```

---

## 🔍 Estrutura dos Arquivos

```
src/components/lib/
├── metaEvents.ts          # Funções principais de tracking
└── useMetaTracking.ts     # Hooks React para facilitar uso

src/components/
├── AnalyticsScripts.tsx    # Scripts de analytics + scroll tracking
├── modalContactsCourses/
│   └── modal.tsx          # Tracking de abertura/fechamento de modal
├── header.tsx             # Tracking de formulário no header
└── courseInformations.tsx # Tracking de formulário em curso

src/app/
└── cursos/[slug]/page.tsx # Tracking de ViewContent
```

---

## ⚠️ Importante

1. **Não exponha Access Token no cliente-side em produção**
   - Use servidor-side com proxy

2. **Verifique consentimento de cookies**
   - Eventos só são enviados se `cookieConsent === "accepted"`

3. **Dados pessoais (email, telefone) são hasheados automaticamente pela API do Meta**
   - Não precisa fazer hash manual

4. **External ID**: Usamos o telefone normalizado como `external_id`
   - Formato: `55` + DDD + número (ex: `5531973144070`)

5. **Event ID**: Gerado automaticamente para evitar duplicação
   - Formato: `timestamp_randomstring`

---

## 📚 Documentação Oficial

- [Facebook Conversion API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Eventos Padrão](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters-for-events)
- [User Data Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters-for-events#user-data-parameters)

---

## 🐛 Troubleshooting

### Eventos não estão sendo enviados

1. Verifique se as variáveis de ambiente estão configuradas
2. Verifique o console do navegador para erros
3. Verifique se o consentimento de cookies foi aceito
4. Verifique se o Access Token está válido

### Eventos duplicados

- O sistema usa `event_id` para evitar duplicação
- Verifique se o mesmo evento não está sendo disparado múltiplas vezes

### Dados não aparecem no Facebook Events Manager

1. Aguarde até 20 minutos (processamento do Facebook)
2. Verifique se o Pixel ID está correto
3. Verifique se o Access Token tem permissões corretas
4. Verifique se os dados estão no formato correto

---

**Última atualização**: Janeiro 2025

