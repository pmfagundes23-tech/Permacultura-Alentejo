import { Principle } from "@/types/schema";

// Bússola: as 3 éticas e os 12 princípios de David Holmgren, com uma
// pergunta que provoca reflexão e um exemplo aplicado ao Alentejo em cada.

export const ETICAS: Principle[] = [
  {
    id: "etica-cuidar-terra",
    type: "ética",
    number: 1,
    name_pt: "Cuidar da Terra",
    short_description:
      "Garantir que todos os sistemas vivos continuam e se multiplicam. Sem solo, água e biodiversidade saudáveis, nada do resto é possível.",
    provocation: "As tuas decisões neste terreno deixam o solo mais vivo, ou mais pobre, daqui a dez anos?",
    alentejo_example: "Preferir manter e proteger um sobreiral existente a limpá-lo para abrir mais área de cultivo.",
    icon: "🌍",
  },
  {
    id: "etica-cuidar-pessoas",
    type: "ética",
    number: 2,
    name_pt: "Cuidar das Pessoas",
    short_description:
      "Garantir acesso aos recursos necessários para a existência e o bem-estar — o próprio, a família, a comunidade.",
    provocation: "Este desenho é sustentável para ti, com o tempo e a energia que realmente tens disponíveis?",
    alentejo_example: "Dimensionar a horta ao tempo real que passas no terreno, não ao tempo que gostarias de ter.",
    icon: "🤝",
  },
  {
    id: "etica-partilha-justa",
    type: "ética",
    number: 3,
    name_pt: "Partilha Justa",
    short_description:
      "Limitar o consumo e a reprodução, e redistribuir os excedentes em prol das duas éticas anteriores.",
    provocation: "O que fazes ao excedente — sementes, mudas, conhecimento, colheita — quando o tens a mais?",
    alentejo_example:
      "Trocar sementes crioulas e mudas com outras hortas comunitárias do Alentejo em vez de as deixar perder-se.",
    icon: "⚖️",
  },
];

export const PRINCIPIOS: Principle[] = [
  {
    id: "principio-observar-interagir",
    type: "princípio",
    number: 1,
    name_pt: "Observar e interagir",
    short_description: "Passa tempo a observar o terreno antes de agir. A paisagem já tem respostas — só precisas de as ler.",
    provocation: "Já viste este terreno num dia de chuva forte? E no pico do calor de agosto?",
    alentejo_example: "Antes de cavar swales, observa por onde a água já corre naturalmente depois de um aguaceiro.",
    icon: "👁️",
  },
  {
    id: "principio-captar-energia",
    type: "princípio",
    number: 2,
    name_pt: "Captar e armazenar energia",
    short_description:
      "Aproveita os recursos abundantes agora (chuva de inverno, sol, biomassa) para os teres disponíveis quando escassearem.",
    provocation: "Onde está a energia a passar pelo teu terreno sem ser aproveitada?",
    alentejo_example: "Captar a água de outubro a abril em cisternas e swales para chegar aos 4-5 meses de seca do verão.",
    icon: "🔋",
  },
  {
    id: "principio-obter-rendimento",
    type: "princípio",
    number: 3,
    name_pt: "Obter rendimento",
    short_description: "Todo o sistema deve produzir algo de útil — sem retorno real, não há motivação para manter o esforço.",
    provocation: "O que este elemento do desenho te devolve, além de trabalho?",
    alentejo_example: "Uma sebe de romãzeiras funciona como vedação e ainda dá fruto.",
    icon: "🌾",
  },
  {
    id: "principio-autorregulacao",
    type: "princípio",
    number: 4,
    name_pt: "Aplicar autorregulação e aceitar retorno",
    short_description:
      "Presta atenção aos sinais de que algo não está a funcionar, e corrige — em vez de insistir contra a evidência.",
    provocation: "O que neste terreno te está a dizer 'não' de forma consistente?",
    alentejo_example:
      "Se uma espécie morre todos os verões apesar da rega, o problema não é falta de cuidado — é a escolha errada para o local.",
    icon: "🔄",
  },
  {
    id: "principio-recursos-renovaveis",
    type: "princípio",
    number: 5,
    name_pt: "Usar e valorizar recursos e serviços renováveis",
    short_description: "Prioriza o que se renova sozinho (sol, vento, biomassa, fixação de azoto) em vez de recursos que se esgotam.",
    provocation: "Isto podia ser feito por uma planta ou um animal, em vez de por um saco comprado?",
    alentejo_example: "Usar tremoço e trevo-subterrâneo para fixar azoto em vez de adubo sintético.",
    icon: "♻️",
  },
  {
    id: "principio-nao-desperdicar",
    type: "princípio",
    number: 6,
    name_pt: "Não produzir desperdício",
    short_description:
      "Tudo o que sobra de um elemento é o recurso de entrada de outro. Desperdício é só um recurso ainda não aproveitado.",
    provocation: "Para onde vai o que sobra deste elemento — lixo, ou alimento de outra parte do sistema?",
    alentejo_example: "Restos de poda de oliveira e sobreiro viram cobertura morta em vez de irem para a queima.",
    icon: "🗑️",
  },
  {
    id: "principio-padroes-detalhes",
    type: "princípio",
    number: 7,
    name_pt: "Desenhar dos padrões aos detalhes",
    short_description: "Começa pela visão geral do terreno (zonas, setores, fluxos) antes de decidires onde vai cada planta.",
    provocation: "Já sabes onde ficam as tuas zonas antes de escolheres as espécies?",
    alentejo_example: "Definir primeiro o zoneamento 0-5 do terreno, e só depois escolher que árvore vai em cada zona.",
    icon: "🗺️",
  },
  {
    id: "principio-integrar",
    type: "princípio",
    number: 8,
    name_pt: "Integrar em vez de segregar",
    short_description: "Coloca elementos em relação uns com os outros — cada elemento apoia vários outros, em vez de estar isolado.",
    provocation: "Este elemento está sozinho, ou em relação com o resto do sistema?",
    alentejo_example: "Galinhas debaixo de árvores de fruto: controlam pragas, adubam o solo e ainda dão ovos.",
    icon: "🔗",
  },
  {
    id: "principio-pequeno-lento",
    type: "princípio",
    number: 9,
    name_pt: "Usar soluções pequenas e lentas",
    short_description: "Sistemas pequenos e geridos devagar são mais fáceis de manter e de corrigir do que grandes intervenções rápidas.",
    provocation: "Precisas mesmo de transformar tudo já, ou podes começar por um canto do terreno?",
    alentejo_example: "Começar com uma Zona 1 pequena e bem cuidada, em vez de plantar o terreno todo no primeiro ano.",
    icon: "🐌",
  },
  {
    id: "principio-diversidade",
    type: "princípio",
    number: 10,
    name_pt: "Usar e valorizar a diversidade",
    short_description: "Muitas espécies diferentes tornam o sistema mais resiliente a pragas, doenças e anos maus.",
    provocation: "Se uma praga atacasse a tua espécie principal amanhã, o que sobrava?",
    alentejo_example: "Misturar oliveira, amendoeira e figueira em vez de um pomar de uma só espécie.",
    icon: "🌈",
  },
  {
    id: "principio-bordaduras",
    type: "princípio",
    number: 11,
    name_pt: "Usar as bordaduras e valorizar o marginal",
    short_description:
      "As margens entre dois sistemas (bosque e campo, terra e água) são normalmente as zonas mais produtivas e diversas.",
    provocation: "Onde estão as bordas do teu terreno, e o que estás a fazer com elas?",
    alentejo_example: "Plantar a orla de uma charca ou linha de água, em vez de deixar essa faixa por aproveitar.",
    icon: "🌿",
  },
  {
    id: "principio-criatividade-mudanca",
    type: "princípio",
    number: 12,
    name_pt: "Usar a criatividade e responder à mudança",
    short_description:
      "O clima está a mudar — a permacultura não é uma receita fixa, é uma forma de observar e ajustar continuamente.",
    provocation: "O que funcionou há 20 anos neste terreno ainda funciona hoje?",
    alentejo_example: "Rever a escolha de espécies à medida que os verões no Alentejo ficam mais longos e mais quentes.",
    icon: "💡",
  },
];
