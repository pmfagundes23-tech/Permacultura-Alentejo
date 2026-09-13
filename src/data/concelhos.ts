// Posições relativas (0-100%) estilizadas dos concelhos do Alentejo dentro
// do mapa ilustrativo usado em MapaComunitario. Não são coordenadas GPS
// reais — são uma aproximação estética da disposição geográfica da região,
// suficiente para um mapa comunitário estilizado.

export interface ConcelhoPosicao {
  nome: string;
  x: number;
  y: number;
}

export const CONCELHOS_ALENTEJO: ConcelhoPosicao[] = [
  { nome: "Portalegre", x: 66, y: 8 },
  { nome: "Elvas", x: 85, y: 22 },
  { nome: "Estremoz", x: 60, y: 28 },
  { nome: "Évora", x: 50, y: 38 },
  { nome: "Montemor-o-Novo", x: 35, y: 35 },
  { nome: "Vendas Novas", x: 25, y: 28 },
  { nome: "Reguengos de Monsaraz", x: 65, y: 45 },
  { nome: "Vila Viçosa", x: 65, y: 35 },
  { nome: "Redondo", x: 58, y: 42 },
  { nome: "Viana do Alentejo", x: 48, y: 48 },
  { nome: "Mourão", x: 75, y: 50 },
  { nome: "Moura", x: 68, y: 58 },
  { nome: "Beja", x: 48, y: 62 },
  { nome: "Serpa", x: 65, y: 68 },
  { nome: "Ferreira do Alentejo", x: 38, y: 58 },
  { nome: "Cuba", x: 48, y: 55 },
  { nome: "Vidigueira", x: 55, y: 55 },
  { nome: "Aljustrel", x: 35, y: 68 },
  { nome: "Ourique", x: 28, y: 75 },
  { nome: "Almodôvar", x: 42, y: 80 },
  { nome: "Mértola", x: 60, y: 85 },
  { nome: "Odemira", x: 15, y: 85 },
  { nome: "Sines", x: 10, y: 68 },
  { nome: "Santiago do Cacém", x: 15, y: 58 },
  { nome: "Grândola", x: 20, y: 50 },
  { nome: "Ponte de Sor", x: 45, y: 10 },
  { nome: "Avis", x: 42, y: 18 },
  { nome: "Mora", x: 32, y: 22 },
  { nome: "Arraiolos", x: 42, y: 32 },
  { nome: "Sousel", x: 55, y: 18 },
  { nome: "Monforte", x: 68, y: 18 },
  { nome: "Campo Maior", x: 82, y: 12 },
  { nome: "Nisa", x: 68, y: 2 },
  { nome: "Crato", x: 62, y: 8 },
  { nome: "Barrancos", x: 90, y: 58 },
  { nome: "Alvito", x: 45, y: 58 },
];

export function posicaoDoConcelho(nome: string): { x: number; y: number } {
  const encontrado = CONCELHOS_ALENTEJO.find(
    (c) => c.nome.toLowerCase() === nome.trim().toLowerCase()
  );
  return encontrado ?? { x: 50 + (Math.random() * 10 - 5), y: 50 + (Math.random() * 10 - 5) };
}
