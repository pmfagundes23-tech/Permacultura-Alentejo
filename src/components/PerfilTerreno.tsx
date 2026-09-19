"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, Crosshair, Info } from "lucide-react";
import { Site } from "@/types/schema";
import { RascunhoSite, carregarSite, guardarSite } from "@/lib/site-storage";
import {
  ACCESS_OPTIONS,
  ASPECT_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  EARTHWORK_OPTIONS,
  EROSION_OPTIONS,
  EXISTING_STRUCTURE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  FARM_ANIMAL_OPTIONS,
  FIRE_RISK_OPTIONS,
  GOAL_OPTIONS,
  GROUND_COVER_OPTIONS,
  IRRIGATION_OPTIONS,
  PRESENCE_OPTIONS,
  SEASON_OPTIONS,
  SOIL_TEXTURE_OPTIONS,
  STONINESS_OPTIONS,
  WATER_SOURCE_OPTIONS,
  WIND_DIRECTION_OPTIONS,
  YES_NO_UNKNOWN_OPTIONS,
} from "@/data/site-opcoes";

type Rascunho = RascunhoSite;

type SecaoId = "identificacao" | "localizacao" | "clima" | "agua" | "solo" | "vegetacao" | "pessoa";

const SECOES: { id: SecaoId; titulo: string; icone: string }[] = [
  { id: "identificacao", titulo: "Identificação", icone: "🏷️" },
  { id: "localizacao", titulo: "Localização e forma", icone: "📍" },
  { id: "clima", titulo: "Clima", icone: "🌤️" },
  { id: "agua", titulo: "Água", icone: "💧" },
  { id: "solo", titulo: "Solo", icone: "🪨" },
  { id: "vegetacao", titulo: "Vegetação existente", icone: "🌳" },
  { id: "pessoa", titulo: "Sobre ti e os teus objetivos", icone: "🙋" },
];

export default function PerfilTerreno() {
  const [site, setSite] = useState<Rascunho>({});
  const [secaoAberta, setSecaoAberta] = useState<SecaoId | null>("identificacao");
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setSite(carregarSite());
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    guardarSite(site);
  }, [site, carregado]);

  function atualizar<K extends keyof Site>(chave: K, valor: Site[K]) {
    setSite((atual) => ({ ...atual, [chave]: valor }));
  }

  const perfilBasicoCompleto = Boolean(site.name && site.latitude !== undefined && site.longitude !== undefined);

  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      <div className="mb-4 flex items-start gap-2 rounded-xl2 border border-oliva/20 bg-oliva/5 px-3 py-2.5 text-xs text-terra-dark/80">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
        <span>
          Este perfil alimenta as recomendações de plantas e o desenho do teu terreno. Preenche o
          que souberes agora — podes voltar e completar mais tarde. Tudo fica guardado neste
          dispositivo.
        </span>
      </div>

      {!perfilBasicoCompleto && (
        <div className="mb-4 flex items-start gap-2 rounded-xl2 border border-terra/25 bg-terra/5 px-3 py-2.5 text-xs text-terra-dark/80">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-terra" />
          <span>Falta o nome e a localização do terreno — são os únicos campos obrigatórios.</span>
        </div>
      )}

      <div className="space-y-2.5 pb-4">
        {SECOES.map((secao) => (
          <SecaoAccordion
            key={secao.id}
            titulo={secao.titulo}
            icone={secao.icone}
            aberta={secaoAberta === secao.id}
            onClick={() => setSecaoAberta(secaoAberta === secao.id ? null : secao.id)}
          >
            {secao.id === "identificacao" && <SecaoIdentificacao site={site} atualizar={atualizar} />}
            {secao.id === "localizacao" && <SecaoLocalizacao site={site} atualizar={atualizar} />}
            {secao.id === "clima" && <SecaoClima site={site} atualizar={atualizar} />}
            {secao.id === "agua" && <SecaoAgua site={site} atualizar={atualizar} />}
            {secao.id === "solo" && <SecaoSolo site={site} atualizar={atualizar} />}
            {secao.id === "vegetacao" && <SecaoVegetacao site={site} atualizar={atualizar} />}
            {secao.id === "pessoa" && <SecaoPessoa site={site} atualizar={atualizar} />}
          </SecaoAccordion>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componentes genéricos de campo
// ---------------------------------------------------------------------------

function SecaoAccordion({
  titulo,
  icone,
  aberta,
  onClick,
  children,
}: {
  titulo: string;
  icone: string;
  aberta: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-terra/10 bg-white shadow-soft">
      <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oliva/10 text-base">
          {icone}
        </span>
        <span className="flex-1 text-sm font-semibold text-terra-dark">{titulo}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-terra-dark/40 transition-transform ${aberta ? "rotate-180" : ""}`}
        />
      </button>
      {aberta && <div className="space-y-4 border-t border-terra/10 bg-areia/30 px-4 py-4">{children}</div>}
    </div>
  );
}

function Campo({ label, ajuda, children }: { label: string; ajuda?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
        {label}
      </span>
      {children}
      {ajuda && <span className="mt-1 block text-[11px] text-terra-dark/45">{ajuda}</span>}
    </label>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-terra/20 bg-white px-3 py-2.5 text-sm text-terra-dark outline-none focus:border-oliva";
}

function CampoTexto({
  label,
  valor,
  onChange,
  placeholder,
  ajuda,
  textarea,
}: {
  label: string;
  valor?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ajuda?: string;
  textarea?: boolean;
}) {
  return (
    <Campo label={label} ajuda={ajuda}>
      {textarea ? (
        <textarea
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${inputClass()} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass()}
        />
      )}
    </Campo>
  );
}

function CampoNumero({
  label,
  valor,
  onChange,
  unidade,
  ajuda,
  min,
  max,
  step,
}: {
  label: string;
  valor?: number;
  onChange: (v: number | undefined) => void;
  unidade?: string;
  ajuda?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <Campo label={unidade ? `${label} (${unidade})` : label} ajuda={ajuda}>
      <input
        type="number"
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        min={min}
        max={max}
        step={step ?? "any"}
        className={inputClass()}
      />
    </Campo>
  );
}

function CampoSelect<T extends string>({
  label,
  valor,
  opcoes,
  onChange,
  ajuda,
}: {
  label: string;
  valor?: T;
  opcoes: T[];
  onChange: (v: T) => void;
  ajuda?: string;
}) {
  return (
    <Campo label={label} ajuda={ajuda}>
      <select
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value as T)}
        className={inputClass()}
      >
        <option value="" disabled>
          Escolhe...
        </option>
        {opcoes.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Campo>
  );
}

function CampoMultiSelect<T extends string>({
  label,
  valores,
  opcoes,
  onChange,
  ajuda,
}: {
  label: string;
  valores?: T[];
  opcoes: T[];
  onChange: (v: T[]) => void;
  ajuda?: string;
}) {
  const atuais = valores ?? [];
  function alternar(opcao: T) {
    onChange(atuais.includes(opcao) ? atuais.filter((v) => v !== opcao) : [...atuais, opcao]);
  }
  return (
    <Campo label={label} ajuda={ajuda}>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((opcao) => {
          const ativo = atuais.includes(opcao);
          return (
            <button
              key={opcao}
              type="button"
              onClick={() => alternar(opcao)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                ativo ? "border-oliva bg-oliva text-bege" : "border-terra/20 bg-white text-terra-dark/70"
              }`}
            >
              {opcao}
            </button>
          );
        })}
      </div>
    </Campo>
  );
}

function CampoBooleano({
  label,
  valor,
  onChange,
}: {
  label: string;
  valor?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-terra/20 bg-white px-3 py-2.5">
      <span className="text-sm text-terra-dark">{label}</span>
      <div className="flex gap-1.5">
        {[
          { rotulo: "Sim", v: true },
          { rotulo: "Não", v: false },
        ].map((op) => (
          <button
            key={op.rotulo}
            type="button"
            onClick={() => onChange(op.v)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              valor === op.v ? "border-oliva bg-oliva text-bege" : "border-terra/20 bg-white text-terra-dark/60"
            }`}
          >
            {op.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grupos de campos
// ---------------------------------------------------------------------------

interface SecaoProps {
  site: Rascunho;
  atualizar: <K extends keyof Site>(chave: K, valor: Site[K]) => void;
}

function SecaoIdentificacao({ site, atualizar }: SecaoProps) {
  return (
    <>
      <CampoTexto
        label="Nome do terreno *"
        valor={site.name}
        onChange={(v) => atualizar("name", v)}
        placeholder="Ex: Monte da Figueira"
      />
      <CampoTexto
        label="Notas livres"
        valor={site.notes}
        onChange={(v) => atualizar("notes", v)}
        placeholder="Qualquer coisa que valha a pena lembrar sobre este terreno..."
        textarea
      />
    </>
  );
}

function SecaoLocalizacao({ site, atualizar }: SecaoProps) {
  const [aObter, setAObter] = useState(false);
  const [erroGps, setErroGps] = useState("");

  function usarLocalizacaoAtual() {
    if (!("geolocation" in navigator)) {
      setErroGps("O teu browser não suporta geolocalização.");
      return;
    }
    setAObter(true);
    setErroGps("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        atualizar("latitude", pos.coords.latitude);
        atualizar("longitude", pos.coords.longitude);
        if (pos.coords.altitude) atualizar("altitude_m", Math.round(pos.coords.altitude));
        setAObter(false);
      },
      () => {
        setErroGps("Não foi possível obter a localização — verifica as permissões do browser.");
        setAObter(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={usarLocalizacaoAtual}
        disabled={aObter}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-oliva px-3.5 py-2.5 text-xs font-semibold text-bege shadow-soft active:scale-95 disabled:opacity-50"
      >
        <Crosshair className="h-4 w-4" />
        {aObter ? "A obter localização..." : "Usar a minha localização atual"}
      </button>
      {erroGps && <p className="text-xs text-terra">{erroGps}</p>}

      <div className="grid grid-cols-2 gap-3">
        <CampoNumero label="Latitude *" valor={site.latitude} onChange={(v) => atualizar("latitude", v as number)} step={0.000001} />
        <CampoNumero label="Longitude *" valor={site.longitude} onChange={(v) => atualizar("longitude", v as number)} step={0.000001} />
      </div>

      <CampoNumero
        label="Área"
        unidade="ha"
        valor={site.area_ha}
        onChange={(v) => atualizar("area_ha", v as number)}
      />
      <CampoNumero
        label="Altitude"
        unidade="m"
        valor={site.altitude_m}
        onChange={(v) => atualizar("altitude_m", v as number)}
      />
      <CampoNumero
        label="Declive médio"
        unidade="%"
        valor={site.slope_percent}
        onChange={(v) => atualizar("slope_percent", v as number)}
        ajuda="Sem instrumentos? Um declive que se caminha confortavelmente ronda 0-10%; um declive visivelmente inclinado, 15-25%."
      />
      <CampoSelect
        label="Exposição da encosta"
        valor={site.aspect}
        opcoes={ASPECT_OPTIONS}
        onChange={(v) => atualizar("aspect", v)}
        ajuda="No Alentejo, uma encosta a sul recebe muito mais calor e seca no verão do que uma encosta a norte."
      />
      <CampoMultiSelect
        label="Acessos"
        valores={site.access}
        opcoes={ACCESS_OPTIONS}
        onChange={(v) => atualizar("access", v)}
      />
      <CampoMultiSelect
        label="Construções existentes"
        valores={site.existing_structures}
        opcoes={EXISTING_STRUCTURE_OPTIONS}
        onChange={(v) => atualizar("existing_structures", v)}
      />
    </>
  );
}

function SecaoClima({ site, atualizar }: SecaoProps) {
  return (
    <>
      <div className="flex items-start gap-2 rounded-lg bg-terra/5 px-3 py-2 text-[11px] text-terra-dark/70">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terra" />
        <span>
          Preenchimento automático a partir da localização fica para uma fase futura. Por agora
          introduz o que souberes — mesmo valores aproximados já ajudam.
        </span>
      </div>
      <CampoNumero
        label="Precipitação anual"
        unidade="mm"
        valor={site.rainfall_annual_mm}
        onChange={(v) => atualizar("rainfall_annual_mm", v as number)}
        ajuda="Valor típico no Alentejo: 500-650 mm/ano, concentrados entre outubro e abril."
      />
      <CampoTexto
        label="Zona de rusticidade"
        valor={site.hardiness_zone}
        onChange={(v) => atualizar("hardiness_zone", v)}
        placeholder="Ex: USDA 9b"
      />
      <div className="grid grid-cols-2 gap-3">
        <CampoTexto
          label="Última geada"
          valor={site.last_frost}
          onChange={(v) => atualizar("last_frost", v)}
          placeholder="MM-DD, ex: 03-15"
        />
        <CampoTexto
          label="Primeira geada"
          valor={site.first_frost}
          onChange={(v) => atualizar("first_frost", v)}
          placeholder="MM-DD, ex: 11-20"
        />
      </div>
      <CampoSelect
        label="Vento dominante"
        valor={site.dominant_wind_direction}
        opcoes={WIND_DIRECTION_OPTIONS}
        onChange={(v) => atualizar("dominant_wind_direction", v)}
      />
      <CampoMultiSelect
        label="Época de vento mais forte"
        valores={site.wind_season}
        opcoes={SEASON_OPTIONS}
        onChange={(v) => atualizar("wind_season", v)}
      />
      <CampoSelect
        label="Risco de incêndio"
        valor={site.fire_risk}
        opcoes={FIRE_RISK_OPTIONS}
        onChange={(v) => atualizar("fire_risk", v)}
        ajuda="Condiciona a faixa de gestão de combustível obrigatória junto a construções."
      />
    </>
  );
}

function SecaoAgua({ site, atualizar }: SecaoProps) {
  return (
    <>
      <div className="flex items-start gap-2 rounded-lg bg-terra/5 px-3 py-2 text-[11px] text-terra-dark/70">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terra" />
        <span>É a variável mais limitante no Alentejo — vale a pena preencher com cuidado.</span>
      </div>
      <CampoMultiSelect
        label="Origens de água"
        valores={site.water_sources}
        opcoes={WATER_SOURCE_OPTIONS}
        onChange={(v) => atualizar("water_sources", v)}
      />
      <CampoNumero
        label="Caudal estimado"
        unidade="litros/hora"
        valor={site.water_flow_lh}
        onChange={(v) => atualizar("water_flow_lh", v as number)}
      />
      <CampoSelect
        label="Seca no verão?"
        valor={site.dries_in_summer}
        opcoes={YES_NO_UNKNOWN_OPTIONS}
        onChange={(v) => atualizar("dries_in_summer", v)}
      />
      <CampoNumero
        label="Armazenamento existente"
        unidade="litros"
        valor={site.storage_liters}
        onChange={(v) => atualizar("storage_liters", v as number)}
      />
      <CampoNumero
        label="Área de telhado para captação"
        unidade="m²"
        valor={site.roof_area_m2}
        onChange={(v) => atualizar("roof_area_m2", v as number)}
      />
      <CampoMultiSelect
        label="Estruturas de água já existentes"
        valores={site.existing_earthworks}
        opcoes={EARTHWORK_OPTIONS}
        onChange={(v) => atualizar("existing_earthworks", v)}
      />
      <CampoSelect
        label="Rega instalada"
        valor={site.irrigation}
        opcoes={IRRIGATION_OPTIONS}
        onChange={(v) => atualizar("irrigation", v)}
      />
    </>
  );
}

function SecaoSolo({ site, atualizar }: SecaoProps) {
  return (
    <>
      <CampoSelect
        label="Textura"
        valor={site.soil_texture}
        opcoes={SOIL_TEXTURE_OPTIONS}
        onChange={(v) => atualizar("soil_texture", v)}
        ajuda="Não sabes? O teste do frasco (sedimentação) ajuda a estimar — fica planeado como guia futuro."
      />
      <CampoNumero
        label="pH"
        valor={site.ph}
        onChange={(v) => atualizar("ph", v as number)}
        min={3}
        max={10}
        step={0.1}
      />
      <CampoNumero
        label="Profundidade até à rocha"
        unidade="cm"
        valor={site.depth_cm}
        onChange={(v) => atualizar("depth_cm", v as number)}
      />
      <CampoSelect
        label="Pedregosidade"
        valor={site.stoniness}
        opcoes={STONINESS_OPTIONS}
        onChange={(v) => atualizar("stoniness", v)}
      />
      <CampoNumero
        label="Matéria orgânica"
        unidade="%"
        valor={site.organic_matter_percent}
        onChange={(v) => atualizar("organic_matter_percent", v as number)}
      />
      <CampoBooleano
        label="Sinais de compactação"
        valor={site.compaction}
        onChange={(v) => atualizar("compaction", v)}
      />
      <CampoSelect
        label="Sinais de erosão"
        valor={site.erosion}
        opcoes={EROSION_OPTIONS}
        onChange={(v) => atualizar("erosion", v)}
      />
    </>
  );
}

function SecaoVegetacao({ site, atualizar }: SecaoProps) {
  return (
    <>
      <CampoNumero
        label="Número de sobreiros"
        valor={site.cork_oak_count}
        onChange={(v) => atualizar("cork_oak_count", v as number)}
        min={0}
      />
      {Boolean(site.cork_oak_count) && (
        <AvisoLegal texto="Sobreiro (Quercus suber) é espécie protegida por lei em Portugal. Corte e poda estão regulados e exigem autorização do ICNF." />
      )}
      <CampoNumero
        label="Número de azinheiras"
        valor={site.holm_oak_count}
        onChange={(v) => atualizar("holm_oak_count", v as number)}
        min={0}
      />
      {Boolean(site.holm_oak_count) && (
        <AvisoLegal texto="Azinheira (Quercus rotundifolia) é espécie protegida por lei em Portugal. Corte e poda estão regulados e exigem autorização do ICNF." />
      )}
      <CampoMultiSelect
        label="Cobertura do solo"
        valores={site.ground_cover}
        opcoes={GROUND_COVER_OPTIONS}
        onChange={(v) => atualizar("ground_cover", v)}
      />
    </>
  );
}

function AvisoLegal({ texto }: { texto: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-terra/30 bg-terra/10 px-3 py-2 text-[11px] text-terra-dark">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terra" />
      <span>{texto}</span>
    </div>
  );
}

function SecaoPessoa({ site, atualizar }: SecaoProps) {
  return (
    <>
      <CampoMultiSelect
        label="Objetivo principal"
        valores={site.goal}
        opcoes={GOAL_OPTIONS}
        onChange={(v) => atualizar("goal", v)}
      />
      <CampoNumero
        label="Horas por semana disponíveis"
        unidade="horas"
        valor={site.hours_per_week}
        onChange={(v) => atualizar("hours_per_week", v as number)}
      />
      <CampoSelect
        label="Presença no terreno"
        valor={site.presence}
        opcoes={PRESENCE_OPTIONS}
        onChange={(v) => atualizar("presence", v)}
        ajuda="Não faz sentido propor uma horta intensiva a quem visita o terreno de 15 em 15 dias."
      />
      <CampoSelect
        label="Experiência"
        valor={site.experience_level}
        opcoes={EXPERIENCE_LEVEL_OPTIONS}
        onChange={(v) => atualizar("experience_level", v)}
      />
      <CampoSelect
        label="Orçamento disponível"
        valor={site.budget_range}
        opcoes={BUDGET_RANGE_OPTIONS}
        onChange={(v) => atualizar("budget_range", v)}
      />
      <CampoMultiSelect
        label="Animais que já tens"
        valores={site.animals_current}
        opcoes={FARM_ANIMAL_OPTIONS}
        onChange={(v) => atualizar("animals_current", v)}
      />
      <CampoMultiSelect
        label="Animais que gostarias de ter"
        valores={site.animals_wanted}
        opcoes={FARM_ANIMAL_OPTIONS}
        onChange={(v) => atualizar("animals_wanted", v)}
      />
    </>
  );
}
