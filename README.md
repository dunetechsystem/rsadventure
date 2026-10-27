# RS Adventure — site

Next.js 16 + Tailwind 4. Passeios, preços, fotos e contato vêm do **DunasTour** (slug `rs-adventure`,
mesmo contrato do link `dunastour.com.br/rs-adventure`) — mesma base dos sites da Mister K e da NOMA, só muda a identidade.

## Rodar

```bash
cp .env.example .env.local
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção
```

## O que muda em relação à NOMA/Mister K

- **Visual**: azul-noite (#050c1c) + laranja (#ff6a00), títulos em Outfit, letreiro dos cards em Barlow Condensed.
  Paleta em `src/app/globals.css` (`night`, `flame`, `amber`, `lagoon`).
- **Home**: hero com a marca → Experiências Destaque (Motocross / Quadriciclos) → Passeios coletivos e privativos
  (separados automaticamente: vendido por veículo, sobrevoo ou com risco = privativo) → Por que a RS → Sobre o Ruan →
  galeria → "Experiências reais" (celulares) → lagoas → dúvidas → CTA.
- **Sem foto no DunasTour?** O card usa o pôr do sol em SVG (`ui/DuneScene.tsx`). Cadastre fotos no painel e elas entram sozinhas (cache de 5 min).
- **Motocross** ainda não existe como passeio no DunasTour: o card destaque abre o WhatsApp. Ao cadastrar um passeio com
  "moto" no título, o card passa a apontar pra ele (`site.featured[].match`).

## Marca

- Selo: `public/brand/rs-adventure-logo-v2.png` (+ `-base`/`-moto` pra animação do hero). Fundador: `public/team/ruan.jpg`.
- Ícones da aba: `src/app/favicon.ico`, `icon.png` e `apple-icon.png`.
- **Imagem do link** (WhatsApp, Instagram, Facebook):
  - Home e páginas gerais: `src/app/opengraph-image.jpg` (= `twitter-image.jpg`), 1200×630.
  - Cada passeio/pacote gera o seu card na hora (`src/lib/og-card.tsx`): foto do passeio no DunasTour + selo + nome +
    preço "a partir de". Sem foto, usa as dunas vistas do avião (`src/assets/og-bg.jpg`). Fontes e selo em `src/assets`.
  - Tudo em JPEG abaixo de ~300 KB — acima disso o WhatsApp não mostra a imagem.
  - Mudou a foto e o WhatsApp ainda mostra a antiga? Ele guarda cache: force no
    [Depurador do Facebook](https://developers.facebook.com/tools/debug/) ("Extrair novamente").

## Domínio (rsadventure.tur.br)

1. `NEXT_PUBLIC_SITE_URL=https://rsadventure.tur.br` no `.env` do servidor (canonical, sitemap, robots e links do
   compartilhamento saem dele) e rebuild.
2. DNS no registro.br apontando pro servidor, com HTTPS; `www.rsadventure.tur.br` redirecionando (301) pro sem `www`.
3. No DunasTour: webhook do site em `DUNASTOUR_SITE_WEBHOOKS` → `https://rsadventure.tur.br/api/revalidate`
   (mesmo `REVALIDATE_SECRET`), e o IP do servidor liberado na API.
4. Google Search Console: adicionar o domínio e enviar `https://rsadventure.tur.br/sitemap.xml`.
5. Meta Business: verificar o domínio (necessário pros eventos do pixel contarem nos anúncios).
6. Trocar o link da bio do Instagram e do perfil no Google pelo domínio novo.

## Conteúdo editável

`src/config/site.ts`: slogan, WhatsApp/Instagram de fallback, fundador, manifesto, destaques, "Por que a RS", FAQ,
vídeo do hero, reels do Instagram. Reserva online pelo site (`onlineBooking`) vem desligada: cada passeio abre o WhatsApp.

## Como conecta ao DunasTour

Só o servidor do Next fala com a API (`DUNASTOUR_API_URL`) — libere o IP do servidor no backend. Leituras em
`src/lib/dunastour/server.ts` (cache 5 min); ações do navegador passam por `src/app/api/dunas/[...path]/route.ts`.

## Tráfego pago e vendas

IDs no `.env` (ver `.env.example`): Meta Pixel, GA4, Google Ads (+ rótulo da conversão) e/ou GTM. Sem ID, nada carrega.
Tudo em `src/lib/track.ts` + `src/components/layout/Analytics.tsx`.

| Evento (Meta / GA4) | Quando |
| --- | --- |
| `ViewContent` / `view_item` | Abriu a página de um passeio ou pacote |
| `AddToCart` / `add_to_cart` | Adicionou à viagem/roteiro |
| `InitiateCheckout` / `begin_checkout` | Abriu o carrinho com itens |
| `Lead` / `generate_lead` (+ conversão do Google Ads) | **Qualquer** clique num link do WhatsApp |
| `Purchase` / `purchase` | Reserva enviada pelo `/reservar` (com `onlineBooking` ligado) — o DunasTour manda o mesmo pela API de Conversões |

O `Lead` sai de um ouvinte único em todo link `api.whatsapp.com`, então botão novo de WhatsApp já entra no
rastreio; `data-lead` (o que é) e `data-value` (valor em R$) no link enriquecem o evento.

**Origem da conversa:** UTM, `gclid` e `fbclid` da visita ficam guardados por 30 dias e vão no fim da mensagem do
WhatsApp (`_ref: google/cpc/lagoa-azul_`). Use UTMs nos anúncios
(`?utm_source=meta&utm_medium=paid&utm_campaign=lagoa-azul`) pra saber qual campanha vendeu.

**A venda (Purchase):** fecha no link de checkout do DunasTour que vai pelo WhatsApp. Cadastre **o mesmo ID do pixel**
no painel do DunasTour (Link de checkout → Pixel do Meta) — de preferência com o token da API de Conversões. Aí o pedido
enviado no link vira `Purchase` no mesmo pixel, ligado ao anúncio pelo telefone/e-mail do cliente.

Para anúncio, mande o tráfego pra página do passeio (`/passeios/<slug>`), não pra home.
