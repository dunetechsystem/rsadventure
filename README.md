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

- Selo: `public/brand/rs-logo.png` (recortado da prancha, fundo transparente, versão para fundo escuro). Fundador: `public/team/ruan.jpg`.
- Imagem de compartilhamento: `public/og.jpg`.

## Conteúdo editável

`src/config/site.ts`: slogan, WhatsApp/Instagram de fallback, fundador, manifesto, destaques, "Por que a RS", FAQ,
vídeo do hero, reels do Instagram. Reserva online pelo site (`onlineBooking`) vem desligada: cada passeio abre o WhatsApp.

## Como conecta ao DunasTour

Só o servidor do Next fala com a API (`DUNASTOUR_API_URL`) — libere o IP do servidor no backend. Leituras em
`src/lib/dunastour/server.ts` (cache 5 min); ações do navegador passam por `src/app/api/dunas/[...path]/route.ts`.
