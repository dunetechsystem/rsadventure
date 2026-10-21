/**
 * Conteúdo editável do site — o que não vem do DunasTour (passeios, preços, fotos e contato vêm
 * da API; ver lib/dunastour). Troque à vontade sem mexer nos componentes.
 */
export const site = {
  name: "RS Adventure",
  legalSuffix: "Passeios & Aventuras",
  tagline: "Transformando turismo em experiências reais",
  slogan: "Não vendemos passeio, vendemos experiência.",
  city: "Barreirinhas · MA · Brasil",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Usados se a API não devolver telefone/Instagram da agência. */
  fallbackWhatsapp: "+55 (98) 99976-1057",
  fallbackInstagram: "rs.adventure__",
  /** Vazio = esconde o ícone do TikTok. */
  tiktok: "",

  /** Fundador (foto em /public/team). */
  founder: { name: "Ruan Soeiro", role: "Fundador da RS Adventure", photo: "/team/ruan.jpg", yearsInTourism: 13 },

  /**
   * Vídeo de fundo do hero (opcional). Coloque um .mp4 leve (até ~8 MB, sem áudio) em
   * /public/videos e aponte aqui, ex.: "/videos/hero.mp4". Vazio = slideshow com as fotos dos passeios.
   */
  heroVideo: "",

  /**
   * Compra pelo site (carrinho, checkout e termo de risco via DunasTour). Desligado = cada passeio
   * mostra só "Verificar disponibilidade", que abre o WhatsApp com o nome do passeio. true pra religar.
   */
  onlineBooking: false,

  /** Reels do Instagram (URL do reel/post). Vazio = a seção mostra os celulares com os bastidores. */
  instagramReels: [] as string[],

  /** Vídeos próprios em formato vertical — arquivos em /public/videos. */
  videos: [] as { src: string; poster?: string; title: string }[],

  manifesto:
    "Há 13 anos o Ruan vive o turismo dos Lençóis. A RS Adventure nasceu desse jeito: roteiros únicos, passeios privativos e momentos que ficam marcados — com segurança, equipamento de verdade e quem conhece cada duna.",

  /** Números do "Sobre". */
  stats: [
    { value: "13", label: "anos no turismo" },
    { value: "100%", label: "passeios guiados" },
    { value: "4x4", label: "quadri, UTV e moto" },
  ],

  /**
   * Cards "Experiências Destaque". Se houver um passeio no DunasTour que case com `match`, o card
   * leva pra ele; senão, abre o WhatsApp com a mensagem.
   */
  featured: [
    {
      badge: "Exclusivo",
      title: "Motocross nos Lençóis",
      text: "Trilhas, adrenalina, areia e emoção em uma experiência radical pelas dunas dos Lençóis Maranhenses.",
      note: "Somente para quem tem experiência",
      sub: "Disponível para aluguel e passeios privativos",
      match: /\bmoto(cross)?\b|moto cross/i,
      message: "Olá, RS Adventure! Quero saber do Motocross nos Lençóis 🏍️",
      scene: "moto",
    },
    {
      badge: "Destaque",
      title: "Quadriciclos",
      text: "A experiência mais procurada da RS Adventure. Passeio pelas dunas, trilhas e lagoas em um roteiro completo cheio de aventura.",
      note: "Disponível para passeios coletivos e privativos",
      sub: "",
      match: /quadri/i,
      message: "Olá, RS Adventure! Quero fazer o passeio de Quadriciclo 😊",
      scene: "quad",
    },
  ],

  /** Faixa animada de destinos abaixo do hero. */
  destinations: [
    "Quadriciclo",
    "Lagoa Azul",
    "Lagoa Bonita",
    "Motocross",
    "UTV",
    "Sobrevoo",
    "Santo Amaro",
    "Atins",
    "Rio Preguiças",
    "Pôr do sol nas dunas",
  ],

  /** "Por que a RS" — blocos coloridos. tone: noite | laranja | lagoa | azul-royal */
  services: [
    { icon: "bike", tone: "laranja", title: "Aventura de verdade", text: "Quadriciclo, UTV e motocross com equipamento revisado, capacete e guia na frente." },
    { icon: "shield", tone: "noite", title: "Segurança em 1º lugar", text: "Briefing antes de sair, ritmo respeitado e acompanhamento durante todo o roteiro." },
    { icon: "users", tone: "azul-royal", title: "Privativo ou coletivo", text: "Vai com o grupo ou só com os seus: você escolhe o formato e a gente monta o roteiro." },
    { icon: "camera", tone: "lagoa", title: "Momentos que ficam", text: "Os melhores pontos de foto, o pôr do sol no lugar certo e o clique que vira capa." },
    { icon: "map", tone: "noite", title: "Roteiro sob medida", text: "Quantos dias, quais lagoas e em que ritmo: a viagem é montada em volta de você." },
    { icon: "heart", tone: "laranja", title: "Gente daqui", text: "13 anos de Lençóis: a gente sabe a hora certa de cada lagoa e o caminho que pouca gente faz." },
  ],

  faqs: [
    {
      question: "Quem é a RS Adventure?",
      answer:
        "Uma agência de passeios e aventuras de Barreirinhas, nos Lençóis Maranhenses, fundada pelo Ruan Soeiro. São 13 anos no turismo, e a ideia é simples: não vender passeio, vender experiência.",
    },
    {
      question: "Como funciona a reserva?",
      answer:
        "Escolha o passeio aqui no site e toque em “Verificar disponibilidade”: a conversa abre no WhatsApp com o passeio já escrito. É só dizer a data e quantas pessoas vão — a RS Adventure confirma a vaga e combina o pagamento por lá.",
    },
    {
      question: "Preciso ter experiência pra pilotar o quadriciclo?",
      answer:
        "Não. O passeio de quadriciclo tem briefing antes de sair e um guia à frente do grupo. Já o motocross é só para quem tem experiência — fale com a gente pelo WhatsApp que a gente avalia junto.",
    },
    {
      question: "Qual a diferença entre passeio coletivo e privativo?",
      answer:
        "No coletivo você divide o veículo e o roteiro com outros viajantes, com preço por pessoa. No privativo o roteiro é só seu, no seu ritmo e com horários combinados — vale para quadriciclo, UTV, moto, lancha e sobrevoo.",
    },
    {
      question: "Qual a melhor época para visitar os Lençóis?",
      answer:
        "As lagoas ficam mais cheias entre junho e setembro, depois da temporada de chuvas. De outubro a dezembro ainda é possível banho em várias lagoas, e o pôr do sol nas dunas é lindo o ano todo.",
    },
    {
      question: "Vocês buscam no hotel?",
      answer:
        "Sim! Na reserva você informa o endereço da sua pousada ou hotel em Barreirinhas e o embarque é feito lá.",
    },
    {
      question: "Criança paga?",
      answer:
        "Crianças de colo (menores de 2 anos) não pagam nos passeios comuns — é só informar na reserva. Passeios de aventura, como quadriciclo, não levam criança de colo.",
    },
    {
      question: "Preciso levar o quê?",
      answer:
        "Protetor solar, óculos de sol, chapéu ou boné, roupa de banho, água e uma sacola pra proteger o celular da areia. Cada passeio mostra mais detalhes.",
    },
  ],
};

export type SiteConfig = typeof site;
