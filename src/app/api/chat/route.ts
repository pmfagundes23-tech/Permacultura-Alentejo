import { NextRequest, NextResponse } from "next/server";
import { ORACULO_SYSTEM_PROMPT } from "@/data/systemPrompt";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Rota de API do "Oráculo Permacultural".
 *
 * Se a variável de ambiente ANTHROPIC_API_KEY estiver definida, a pergunta
 * é enviada à API real da Anthropic (Claude) usando o ORACULO_SYSTEM_PROMPT.
 * Caso contrário, cai automaticamente para um motor de simulação (mock)
 * local, que gera respostas coerentes e sempre estruturadas em 3 passos,
 * permitindo correr `npm run dev` sem qualquer chave de API.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Nenhuma mensagem recebida." }, { status: 400 });
    }

    const ultimaPergunta = messages[messages.length - 1]?.content ?? "";
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const reply = await chamarAnthropic(apiKey, messages);
        return NextResponse.json({ reply, fonte: "anthropic" });
      } catch (erroApi) {
        console.error("Falha ao chamar a API da Anthropic, a usar mock:", erroApi);
        // Continua para o fallback mock em vez de rebentar a experiência do utilizador.
      }
    }

    const reply = gerarRespostaMock(ultimaPergunta);
    return NextResponse.json({ reply, fonte: "mock" });
  } catch (erro) {
    console.error("Erro na rota /api/chat:", erro);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar a tua pergunta." },
      { status: 500 }
    );
  }
}

async function chamarAnthropic(apiKey: string, messages: ChatMessage[]): Promise<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const anthropic = new Anthropic({ apiKey });

  const resposta = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 700,
    system: ORACULO_SYSTEM_PROMPT,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const bloco = resposta.content.find((c) => c.type === "text");
  return bloco && "text" in bloco ? bloco.text : "Não obtive resposta do Oráculo desta vez.";
}

/**
 * Motor de simulação local: escolhe o conjunto de conteúdo mais relevante
 * com base em palavras-chave da pergunta, e devolve sempre no formato
 * obrigatório de 3 passos definido no ORACULO_SYSTEM_PROMPT.
 */
function gerarRespostaMock(pergunta: string): string {
  const p = pergunta.toLowerCase();

  const contemAlguma = (...palavras: string[]) => palavras.some((w) => p.includes(w));

  if (contemAlguma("água", "agua", "évora", "evora", "retenç", "retenc", "reter")) {
    return [
      "1. 📐 Zoneamento (Onde colocar no terreno)",
      "Identifica o ponto mais baixo do teu terreno em Évora — é para ali que a água já quer ir naturalmente. Marca as linhas de curva de nível com um A-frame simples antes de decidir onde intervir.",
      "",
      "2. 💧 Conservação de Água e Solo",
      "Constrói swales (valas de infiltração) em curva de nível, com 30-50cm de profundidade, para abrandar e infiltrar a água em vez de a deixar escorrer. Cobre sempre o solo com 10-15cm de mulch para reduzir a evaporação em dias de calor extremo.",
      "",
      "3. 🌿 O que plantar e quando agir no Alentejo",
      "Planta fruteiras resilientes (figueira, romãzeira, amendoeira) no camalhão formado pela terra escavada do swale. Faz isto no Outono, aproveitando as primeiras chuvas para assentar as plantas antes do Verão seguinte.",
    ].join("\n");
  }

  if (contemAlguma("zona 1", "zona1", "melhores plantas", "plantas para")) {
    return [
      "1. 📐 Zoneamento (Onde colocar no terreno)",
      "A Zona 1 é a área mais próxima de casa, visitada todos os dias — reserva-a para hortícolas, ervas aromáticas e pequenas fruteiras que precisas de colher e regar com frequência.",
      "",
      "2. 💧 Conservação de Água e Solo",
      "Usa canteiros elevados ou em mandala com boa cobertura morta (10-15cm) para reduzir a rega ao mínimo. Aproveita águas cinzentas ou de recolha de telhado para regar esta zona de forma eficiente.",
      "",
      "3. 🌿 O que plantar e quando agir no Alentejo",
      "Na Zona 1 apostam bem: coentro, batata-doce, alho, erva-luísa, poejo e figueira. Planta hortícolas anuais na entrada do Outono ou início da Primavera, evitando o calor extremo do pico do Verão.",
    ].join("\n");
  }

  if (contemAlguma("outono", "chuva", "preparar o solo", "antes das chuvas")) {
    return [
      "1. 📐 Zoneamento (Onde colocar no terreno)",
      "Aproveita o fim do Verão para revisitar todo o terreno e marcar onde a água correu mal no ano anterior — é aí que deves intervir antes das primeiras chuvas fortes de Outono.",
      "",
      "2. 💧 Conservação de Água e Solo",
      "Escava ou limpa os swales existentes, e aplica uma boa camada de composto e mulch (10-15cm) em todos os canteiros para captar a primeira água de forma esponjosa em vez de encharcada. Semeia adubos verdes como tremoço ou trevo-subterrâneo para proteger e fixar azoto no solo durante o Inverno.",
      "",
      "3. 🌿 O que plantar e quando agir no Alentejo",
      "O Outono é a melhor altura do ano para plantar árvores e arbustos (sobreiro, azinheira, alfarrobeira, romãzeira) — a chuva ajuda-os a enraizar sem stress hídrico. Aproveita também para semear alho e favas nas hortícolas.",
    ].join("\n");
  }

  // Resposta genérica de fallback, mantendo sempre a estrutura de 3 passos.
  return [
    "1. 📐 Zoneamento (Onde colocar no terreno)",
    "Observa o teu terreno durante alguns dias: sol, vento dominante e onde a água se acumula naturalmente. Coloca o que precisas visitar todos os dias perto de casa (Zona 1) e o que precisa de pouca intervenção mais longe (Zona 3-5).",
    "",
    "2. 💧 Conservação de Água e Solo",
    "Prioriza sempre reter água no solo antes de pensar em regar: mulching abundante (10-15cm), swales em curva de nível e compostagem simples com os restos orgânicos que já tens em casa.",
    "",
    "3. 🌿 O que plantar e quando agir no Alentejo",
    "Escolhe espécies resilientes à seca como oliveira, alfarrobeira, esteva ou alecrim, e planta-as preferencialmente no Outono para aproveitar as chuvas. Podes explorar o Explorador de Plantas 🌿 para veres mais opções por zona e camada.",
  ].join("\n");
}
