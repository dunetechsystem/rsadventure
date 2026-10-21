import type { Metadata } from "next";
import { getAgency } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Termos de uso e privacidade" };

/** Mesmo texto do link do DunasTour (dunas-tour-web/components/checkout/terms-texts.tsx, versão pt). */
export default async function TermsPage() {
  const agency = await getAgency();
  const name = agency?.tradeName ?? "RS Adventure";
  const phone = agencyInfo(agency).phone;
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-32">
      <article className="rounded-[2rem] bg-night-800 p-6 text-[15px] leading-relaxed text-white/75 ring-1 ring-white/5 sm:p-10 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-white [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="mb-6 font-display text-4xl text-white">Termos de uso</h1>
        <p>
          Estes termos valem entre você (&quot;Contratante&quot;) e <strong>{name}</strong> (&quot;Agência&quot;) para reservas feitas por este site. As
          reservas são registradas pela plataforma DunasTour, que apenas processa o formulário em nome da Agência.
        </p>
        <h2>1. A reserva</h2>
        <p>
          Enviar o formulário é uma <strong>solicitação de reserva</strong>. A Agência confirma a disponibilidade e combina com você, normalmente
          pelo WhatsApp, o pagamento e as condições de cancelamento e reagendamento.
        </p>
        <h2>2. Seus dados</h2>
        <p>
          Você declara que os dados informados são verdadeiros e que tem capacidade civil para contratar, ou que está representado por responsável
          legal, se menor de 18 anos.
        </p>
        <h2>3. Durante o passeio</h2>
        <p>
          Você se compromete a seguir as orientações de segurança da equipe e a informar previamente à Agência qualquer condição de saúde relevante.
          Passeios com atividade de risco (como quadriciclo ou moto) exigem, além destes termos, a assinatura de um Termo de Responsabilidade e
          Ciência de Riscos específico.
        </p>
        <h2>4. Responsabilidade da Agência</h2>
        <p>
          A Agência responde pela execução e pela segurança do serviço contratado, nos termos do Código de Defesa do Consumidor (Lei 8.078/1990). Nada
          nestes termos afasta os seus direitos como consumidor.
        </p>
        <h2>5. Validade do aceite</h2>
        <p>
          Seu aceite eletrônico tem validade jurídica (art. 107 do Código Civil e art. 10, § 2º, da MP 2.200-2/2001). Para fins de prova, ficam
          registrados a data, a hora, o endereço IP e a versão destes termos.
        </p>
        <p>Fica eleito o foro do domicílio do Contratante, ressalvada disposição legal em contrário.</p>

        <h1 id="privacidade" className="mb-6 mt-14 scroll-mt-28 font-display text-4xl text-white">
          Política de privacidade
        </h1>
        <p>
          Esta política segue a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD). A <strong>controladora</strong> dos seus dados é {name}; a
          plataforma DunasTour atua como <strong>operadora</strong>, tratando os dados apenas para registrar a reserva em nome da Agência.
        </p>
        <h2>Quais dados coletamos</h2>
        <ul>
          <li>Nome, e-mail, WhatsApp e, quando informado ou exigido, CPF;</li>
          <li>Passeios escolhidos, datas, número de pessoas, local de embarque e observações;</li>
          <li>Registro dos aceites: data, hora, endereço IP e navegador utilizados.</li>
        </ul>
        <h2>Para que usamos</h2>
        <ul>
          <li>Registrar e executar a sua reserva (LGPD, art. 7º, V — execução de contrato);</li>
          <li>Comprovar os aceites dos termos, inclusive o termo de risco (art. 7º, VI — exercício regular de direitos);</li>
          <li>Reconhecer você em reservas futuras com a mesma Agência e preencher seus dados automaticamente;</li>
          <li>Cumprir obrigações legais e regulatórias (art. 7º, II).</li>
        </ul>
        <h2>Com quem compartilhamos</h2>
        <p>
          Somente com {name} e, quando ela repassar a execução do passeio a uma agência parceira, com essa parceira — apenas o necessário para
          realizar o passeio. Seus dados não são vendidos nem usados para publicidade.
        </p>
        <h2>Por quanto tempo guardamos</h2>
        <p>
          Enquanto forem necessários para a reserva e, depois, pelo prazo em que possam ser exigidos para defesa em processos (em regra, 5 anos — art.
          27 do CDC) ou por obrigação legal.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Você pode pedir confirmação e acesso aos seus dados, correção, anonimização, portabilidade, eliminação dos dados que não precisem ser
          guardados por lei e informações sobre o compartilhamento (LGPD, art. 18). Basta falar com {name} pelo telefone {phone}.
        </p>
        <h2>Dados salvos no seu aparelho</h2>
        <p>
          Se você escolher &quot;Lembrar meus dados neste aparelho&quot;, eles ficam guardados apenas no seu navegador, para agilizar a próxima
          reserva. Você pode apagá-los a qualquer momento pelo botão &quot;Não é você?&quot;.
        </p>
      </article>
    </div>
  );
}
