# 🚀 Como Configurar Meta Events - Sem Erros

## ✅ Correções Aplicadas

Agora o sistema:
- ✅ **Valida configuração antes de enviar** - Não tenta enviar se não estiver configurado
- ✅ **Sanitiza Pixel ID automaticamente** - Remove qualquer caractere inválido
- ✅ **Silencia erros quando não há configuração** - Console limpo
- ✅ **Loga apenas em desenvolvimento** - Produção sem poluição no console
- ✅ **Valida dados antes de enviar** - Garante que há pelo menos um identificador

---

## 📝 Configuração do .env.local

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```env
# ===== Meta/Facebook Pixel (OBRIGATÓRIO) =====
# Pixel ID: Apenas números (sem letras, sem "x" no final)
# Exemplo: 637449189084964 (correto)
# ❌ Errado: 637449189084964x
NEXT_PUBLIC_META_PIXEL_ID=637449189084964

# Access Token: Token gerado no Facebook Events Manager
# ⚠️ IMPORTANTE: Este token será exposto no cliente-side
# Para produção, use proxy servidor-side (veja abaixo)
NEXT_PUBLIC_META_ACCESS_TOKEN=seu_access_token_aqui

# ===== Opcional: Test Event Code =====
# Código para testar eventos no Events Manager
# Gere no Events Manager > Test Events
NEXT_PUBLIC_META_TEST_EVENT_CODE=TEST12345

# ===== Opcional: Proxy Servidor (RECOMENDADO para produção) =====
# URL do endpoint de proxy no seu servidor
# Use isso em vez de expor o Access Token no cliente
NEXT_PUBLIC_META_API_URL=http://localhost:3000/api/meta-events
```

---

## 🔍 Como Obter o Pixel ID Correto

1. Acesse [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Selecione seu Pixel
3. Em **Configurações** → **Detalhes**
4. Copie o **ID do Pixel** (apenas os números)
   - ✅ **Correto:** `637449189084964`
   - ❌ **Errado:** `637449189084964x` (não copie o "x")

---

## 🔑 Como Obter o Access Token

### Opção 1: Access Token do Pixel (Cliente-side)

1. No Events Manager, vá em **Configurações** → **Conversions API**
2. Clique em **Gerar Access Token**
3. Copie o token gerado

⚠️ **ATENÇÃO:** Este token será exposto no código do cliente. Use apenas para desenvolvimento ou se não se importar com isso.

### Opção 2: Proxy Servidor (RECOMENDADO) ✅

1. Crie o arquivo `src/app/api/meta-events/route.ts` (veja exemplo abaixo)
2. Configure `META_PIXEL_ID` e `META_ACCESS_TOKEN` no `.env.local` (sem `NEXT_PUBLIC_`)
3. Configure `NEXT_PUBLIC_META_API_URL` apontando para este endpoint

---

## 🛠️ Verificação Rápida

### ✅ Tudo Funcionando

Se tudo estiver correto:
- ✅ Nenhum erro no console
- ✅ Em desenvolvimento, verá: `[Meta Events] ✅ Evento "PageView" enviado com sucesso`
- ✅ Eventos aparecem no Facebook Events Manager

### ❌ Ainda com Erros?

**Erro 400 "Unsupported post request":**
- Verifique se o Pixel ID contém **apenas números** (sem letras, sem "x")
- Verifique se o Access Token está correto

**Erro 401/403 "Invalid Access Token":**
- Token expirado ou inválido
- Gere um novo token no Events Manager

**Erro "Pixel ID ou Access Token não configurados":**
- Verifique se as variáveis estão no `.env.local`
- Reinicie o servidor após alterar `.env.local`

**Erro "Consentimento de cookies não aceito":**
- Aceite os cookies no banner
- Verifique se está salvando em `localStorage`

---

## 🔧 Para Desenvolvimento Local

Se estiver rodando localmente (`localhost`):

1. **Pixel ID** pode ter limitações - mas funciona
2. **Access Token** funciona normalmente
3. Eventos aparecem no Events Manager normalmente

---

## 📋 Checklist de Configuração

- [ ] Pixel ID configurado (apenas números)
- [ ] Access Token configurado
- [ ] Variáveis no `.env.local` (não `.env`)
- [ ] Servidor reiniciado após alterar `.env.local`
- [ ] Cookies aceitos no navegador
- [ ] Nenhum erro no console

---

**Pronto! Agora seu sistema está configurado para funcionar sem erros.** 🎉

