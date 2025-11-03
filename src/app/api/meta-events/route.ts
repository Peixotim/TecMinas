import { NextRequest, NextResponse } from 'next/server';

const META_API_VERSION = 'v21.0';
const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

export async function POST(request: NextRequest) {
  // Validação de variáveis de ambiente
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
    console.error('[Meta API] META_PIXEL_ID ou META_ACCESS_TOKEN não configurados no servidor');
    return NextResponse.json(
      { 
        error: 'Configuração do servidor incompleta',
        message: 'Verifique META_PIXEL_ID e META_ACCESS_TOKEN no .env.local'
      },
      { status: 500 }
    );
  }

  // Sanitiza Pixel ID (apenas números)
  const pixelId = META_PIXEL_ID.match(/\d+/)?.[0];
  if (!pixelId) {
    console.error('[Meta API] META_PIXEL_ID inválido:', META_PIXEL_ID);
    return NextResponse.json(
      { error: 'Pixel ID inválido. Deve conter apenas números.' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    
    // Valida estrutura do payload
    if (!body || !Array.isArray(body.data) || body.data.length === 0) {
      return NextResponse.json(
        { error: 'Payload inválido. Esperado: { data: [...] }' },
        { status: 400 }
      );
    }

    // Constrói URL com access_token na querystring
    const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events`);
    url.searchParams.set('access_token', META_ACCESS_TOKEN);
    
    // Adiciona test_event_code se fornecido
    if (META_TEST_EVENT_CODE) {
      url.searchParams.set('test_event_code', String(META_TEST_EVENT_CODE));
    }

    // Envia para a API do Meta
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: body.data,
      }),
    });

    const data = await response.json();

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      if (!response.ok) {
        console.warn('[Meta API] Erro ao enviar evento:', {
          status: response.status,
          error: data.error,
        });
      } else {
        console.log('[Meta API] ✅ Evento enviado com sucesso');
      }
    }

    // Retorna resposta da API do Meta (mantém status e dados)
    return NextResponse.json(data, { 
      status: response.ok ? 200 : response.status 
    });

  } catch (error) {
    console.error('[Meta API] Erro ao processar requisição:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar evento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Método GET para verificação de saúde (opcional)
export async function GET() {
  const isConfigured = !!(META_PIXEL_ID && META_ACCESS_TOKEN);
  
  return NextResponse.json({
    status: isConfigured ? 'configured' : 'not_configured',
    pixel_id: META_PIXEL_ID ? META_PIXEL_ID.match(/\d+/)?.[0] : null,
    has_access_token: !!META_ACCESS_TOKEN,
  });
}

