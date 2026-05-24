import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATOS ───────────────────────────────────────────────────────────────────

const SECTORES = [
  {
    id: "accesos", emoji: "🚪", color: "#1A6FE8", bg: "#EBF2FF",
    titulo: "Accesos al Edificio", desc: "Entradas principales y secundarias",
    checklist: [
      "Cantidad de accesos",
      "Acceso principal con señalización visible",
      "Sin escalón ni desnivel en la entrada",
      "Ancho de puerta ≥ 90 cm (silla de ruedas)",
      "Puerta de fácil apertura (manija tipo palanca)",
      "Timbre o intercomunicador accesible (h ≤ 120 cm)",
      "Piso antideslizante en umbral",
      "Buena iluminación en acceso",
    ],
    campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 2" }],
    severidad: false,
  },
  {
    id: "rampas", emoji: "♿", color: "#13B385", bg: "#E1F5EE",
    titulo: "Rampas y Accesibilidad Motriz", desc: "Rampas, nivelaciones y circulación",
    checklist: [
      "Ubicación de rampa/s",
      "Pendiente adecuada (≤ 8%)",
      "Ancho mínimo ≥ 90 cm",
      "Pasamanos presente en ambos lados",
      "Superficie antideslizante en buen estado",
      "Señalización visible en pavimento",
      "Espacio de maniobra al inicio y fin (≥ 150 cm)",
      "Sin obstáculos en la rampa",
    ],
    campos: [{ idx: 0, label: "Ubicación", placeholder: "ej: sector norte" }],
    severidad: false,
  },
  {
    id: "escaleras", emoji: "🪜", color: "#E87013", bg: "#FFF3E8",
    titulo: "Escaleras", desc: "Escaleras internas y externas",
    checklist: [
      "Cantidad de escaleras",
      "Pasamanos en ambos lados",
      "Pasamanos continuo (sin interrupciones)",
      "Primer y último escalón diferenciado",
      "Iluminación adecuada en todo el tramo",
      "Superficie antideslizante en peldaños",
      "Señalética visible",
      "Contrahuella cerrada (sin huecos)",
    ],
    campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 3" }],
    severidad: false,
  },
  {
    id: "banios", emoji: "🚻", color: "#7A4FE5", bg: "#F2EEFF",
    titulo: "Baños", desc: "Sanitarios accesibles e inclusivos",
    checklist: [
      "Cantidad de baños",
      "Baño accesible / adaptado disponible",
      "Señalética exterior clara e inclusiva",
      "Puerta con ancho ≥ 80 cm",
      "Espacio de giro interior ≥ 150 cm",
      "Barras de apoyo junto al inodoro",
      "Inodoro a altura entre 45 y 50 cm",
      "Lavabo con espacio libre inferior",
      "Estado general limpio y funcional",
    ],
    campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 4" }],
    severidad: false,
  },
  {
    id: "aulas", emoji: "🏫", color: "#0BA8BB", bg: "#E6F8FA",
    titulo: "Aulas y Salones", desc: "Espacios de formación y actividad",
    checklist: [
      "Número / identificación visible en puerta",
      "Señalética legible (tipografía grande, contraste)",
      "Acceso sin obstáculos en el pasillo",
      "Iluminación suficiente interior",
      "Espacio entre bancos para circulación ≥ 90 cm",
      "Visibilidad del pizarrón desde todos los ángulos",
      "Capacidad aproximada (personas)",
      "Ventilación adecuada",
    ],
    campos: [{ idx: 6, label: "Capacidad", placeholder: "ej: 30" }],
    severidad: false,
  },
  {
    id: "circulacion", emoji: "🛤️", color: "#5A6470", bg: "#F0F2F4",
    titulo: "Pasillos y Circulación", desc: "Corredores, patios y tránsito",
    checklist: [
      "Ancho de pasillo ≥ 120 cm",
      "Sin obstáculos en la circulación principal",
      "Piso en buen estado (sin irregularidades)",
      "Señalética de emergencia visible",
      "Salidas de emergencia señalizadas",
      "Iluminación uniforme en todo el recorrido",
      "Patio interno accesible (sin escalones)",
    ],
    campos: [],
    severidad: false,
  },
  {
    id: "senaletica", emoji: "🗺️", color: "#D4A10A", bg: "#FFF9E6",
    titulo: "Señalética y Orientación", desc: "Carteles, íconos y referencias",
    checklist: [
      "Cartelería general legible (contraste y tamaño)",
      "Mapa o plano del edificio visible en entrada",
      "Señalética en Braille presente",
      "Pictogramas o íconos comprensibles",
      "Numeración de aulas visible desde el pasillo",
      "Indicadores de recorrido de emergencia",
      "Información en lenguaje sencillo",
    ],
    campos: [],
    severidad: false,
  },
  {
    id: "barreras", emoji: "⚠️", color: "#D93535", bg: "#FEECEC",
    titulo: "Barreras e Incidencias", desc: "Obstáculos físicos y comunicacionales",
    checklist: [
      "Obstáculos en pasillos o accesos",
      "Señalética dañada, ausente o ilegible",
      "Puertas difíciles de abrir o sin rampa",
      "Pisos irregulares, rotos o resbaladizos",
      "Falta de iluminación en zonas de tránsito",
      "Barreras comunicacionales (falta de información)",
      "Barreras actitudinales observadas",
      "Otros obstáculos (describir en notas)",
    ],
    campos: [],
    severidad: true,
  },
];

const FOTOS_CONFIG = [
  { label: "Acceso principal", color: "#1A6FE8", bg: "#EBF2FF", icon: "🚪" },
  { label: "Rampa accesible", color: "#13B385", bg: "#E1F5EE", icon: "♿" },
  { label: "Escalera", color: "#E87013", bg: "#FFF3E8", icon: "🪜" },
  { label: "Baño accesible", color: "#7A4FE5", bg: "#F2EEFF", icon: "🚻" },
  { label: "Aula / Salón", color: "#0BA8BB", bg: "#E6F8FA", icon: "🏫" },
  { label: "Barrera detectada", color: "#D93535", bg: "#FEECEC", icon: "⚠️" },
  { label: "Señalética", color: "#D4A10A", bg: "#FFF9E6", icon: "🗺️" },
  { label: "Patio / Circulación", color: "#5A6470", bg: "#F0F2F4", icon: "🛤️" },
  { label: "Vista fachada", color: "#1A3A6E", bg: "#E0E8F5", icon: "🏢" },
  { label: "Otro", color: "#9CA3AF", bg: "#F3F4F6", icon: "📌" },
];

const PROXIMOS_PASOS = [
  { texto: "Volcar datos en planilla compartida (Google Sheets)", rol: "Data" },
  { texto: "Subir fotos al Drive del equipo organizadas por sector", rol: "UX/UI" },
  { texto: "Documentar hallazgos en el tablero del proyecto en GitHub", rol: "Todos" },
  { texto: "Definir sectores críticos para priorizar en el mapa SVG", rol: "UX/UI + Front" },
  { texto: "Registrar coordenadas aproximadas de cada espacio en el plano", rol: "Front" },
  { texto: "Armar fichas descriptivas de cada sector con datos relevados", rol: "UX/UI" },
  { texto: "Reportar barreras detectadas al sistema colaborativo", rol: "QA + Todos" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function crearVisitaVacia(n) {
  return {
    numero: n,
    fecha: new Date().toISOString().split("T")[0],
    responsable: "",
    checks: {},
    notas: {},
    notaGeneral: "",
    camposValores: {},
    severidades: {},
    cronoSegundos: 0,
    fotoData: {},
    fotosNotas: {},
  };
}

function contarChecksVisita(visita, sectorId, len) {
  let n = 0;
  if (!visita.checks) return 0;
  for (let i = 0; i < len; i++) {
    if (visita.checks[`${sectorId}-${i}`]) n++;
  }
  return n;
}

function formatCrono(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// ─── ESTADO INICIAL ───────────────────────────────────────────────────────────

function cargarEstado() {
  try {
    const raw = localStorage.getItem("cfp7_state_v2");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { visitaActual: 1, visitas: { 1: crearVisitaVacia(1) } };
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function Relevamiento() {
  const [state, setState] = useState(cargarEstado);
  const [tab, setTab] = useState("sectores");
  const [sectorAbierto, setSectorAbierto] = useState(null);
  const [altoContraste, setAltoContraste] = useState(false);
  const [cronoActivo, setCronoActivo] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
  const cronoRef = useRef(null);
  const savedTimer = useRef(null);

  const visita = state.visitas[state.visitaActual];

  // ── PERSISTENCIA ────────────────────────────────────────────────────────────

  const guardar = useCallback((newState) => {
    try {
      localStorage.setItem("cfp7_state_v2", JSON.stringify(newState));
      setSavedVisible(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSavedVisible(false), 1500);
    } catch (e) {}
  }, []);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = updater(prev);
      guardar(next);
      return next;
    });
  }, [guardar]);

  const updateVisita = useCallback((updater) => {
    updateState((prev) => ({
      ...prev,
      visitas: {
        ...prev.visitas,
        [prev.visitaActual]: updater(prev.visitas[prev.visitaActual]),
      },
    }));
  }, [updateState]);

  // ── CRONÓMETRO ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (cronoActivo) {
      cronoRef.current = setInterval(() => {
        updateVisita((v) => ({ ...v, cronoSegundos: (v.cronoSegundos || 0) + 1 }));
      }, 1000);
    } else {
      clearInterval(cronoRef.current);
    }
    return () => clearInterval(cronoRef.current);
  }, [cronoActivo, updateVisita]);

  // ── VISITAS ──────────────────────────────────────────────────────────────────

  const nuevaVisita = () => {
    const nums = Object.keys(state.visitas).map(Number);
    const siguiente = Math.max(...nums) + 1;
    updateState((prev) => ({
      ...prev,
      visitaActual: siguiente,
      visitas: { ...prev.visitas, [siguiente]: crearVisitaVacia(siguiente) },
    }));
    setCronoActivo(false);
    setSectorAbierto(null);
    setTab("sectores");
    alert(`✅ Visita ${siguiente} creada. ¡A relevear!`);
  };

  const cambiarVisita = (n) => {
    setCronoActivo(false);
    updateState((prev) => ({ ...prev, visitaActual: parseInt(n) }));
    setSectorAbierto(null);
  };

  // ── CHECKS ───────────────────────────────────────────────────────────────────

  const toggleCheck = (sectorId, i) => {
    const key = `${sectorId}-${i}`;
    updateVisita((v) => ({
      ...v,
      checks: { ...v.checks, [key]: !v.checks[key] },
    }));
  };

  const setCampo = (sectorId, i, val) => {
    const key = `${sectorId}-${i}`;
    updateVisita((v) => ({
      ...v,
      camposValores: { ...v.camposValores, [key]: val },
    }));
  };

  const setSev = (sectorId, i, val) => {
    const key = `${sectorId}-${i}`;
    updateVisita((v) => ({
      ...v,
      severidades: {
        ...v.severidades,
        [key]: v.severidades[key] === val ? null : val,
      },
    }));
  };

  const setNota = (sectorId, val) => {
    updateVisita((v) => ({ ...v, notas: { ...v.notas, [sectorId]: val } }));
  };

  // ── FOTOS ────────────────────────────────────────────────────────────────────

  const onFotoChange = (event, i) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateVisita((v) => ({
        ...v,
        fotoData: { ...v.fotoData, [i]: e.target.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const setFotaNota = (i, val) => {
    updateVisita((v) => ({
      ...v,
      fotosNotas: { ...v.fotosNotas, [i]: val },
    }));
  };

  // ── PROGRESO ─────────────────────────────────────────────────────────────────

  const totalItems = SECTORES.reduce((a, s) => a + s.checklist.length, 0);
  const totalDone = SECTORES.reduce(
    (a, s) => a + contarChecksVisita(visita, s.id, s.checklist.length), 0
  );
  const progresoPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;
  const totalFotos = Object.keys(visita.fotoData || {}).length;
  const totalNotas = SECTORES.filter((s) => visita.notas?.[s.id]).length;
  const totalBarreras = contarChecksVisita(
    visita,
    "barreras",
    SECTORES.find((s) => s.id === "barreras").checklist.length
  );

  // ── EXPORTAR ─────────────────────────────────────────────────────────────────

  const exportarResumen = () => {
    const sep = "─".repeat(40);
    let txt = `╔══════════════════════════════════════╗\n  RELEVAMIENTO DE CAMPO — CFP N.º 7\n  InnovaLab · Visita ${state.visitaActual}\n╚══════════════════════════════════════╝\n\n`;
    if (visita.fecha) txt += `📅 Fecha:       ${visita.fecha}\n`;
    if (visita.responsable) txt += `👤 Equipo:      ${visita.responsable}\n`;
    txt += `⏱ Duración:    ${formatCrono(visita.cronoSegundos || 0)}\n`;
    txt += `📊 Progreso:    ${progresoPct}% (${totalDone}/${totalItems} ítems)\n\n`;
    SECTORES.forEach((s) => {
      const done = contarChecksVisita(visita, s.id, s.checklist.length);
      txt += `${sep}\n${s.emoji} ${s.titulo.toUpperCase()} — ${done}/${s.checklist.length}\n`;
      s.checklist.forEach((item, i) => {
        const key = `${s.id}-${i}`;
        const checked = !!(visita.checks?.[key]);
        const campo = visita.camposValores?.[key];
        const sev = visita.severidades?.[key];
        const sevLabel = sev === "critica" ? " 🔴 CRÍTICA" : sev === "moderada" ? " 🟡 MODERADA" : sev === "leve" ? " 🟢 LEVE" : "";
        txt += `  ${checked ? "✅" : "⬜"} ${item}${campo ? " → " + campo : ""}${sevLabel}\n`;
      });
      if (visita.notas?.[s.id]) txt += `  📝 Nota: ${visita.notas[s.id]}\n`;
      txt += "\n";
    });
    if (visita.notaGeneral) txt += `${sep}\n📝 OBSERVACIONES GENERALES\n${visita.notaGeneral}\n\n`;
    txt += `${sep}\n🚀 PRÓXIMOS PASOS\n`;
    PROXIMOS_PASOS.forEach((p) => { txt += `  → [${p.rol}] ${p.texto}\n`; });
    txt += `\nGenerado: ${new Date().toLocaleString("es-AR")}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(txt).then(() =>
        alert("✅ Resumen copiado al portapapeles.")
      ).catch(() => fallbackCopy(txt));
    } else { fallbackCopy(txt); }
  };

  const fallbackCopy = (txt) => {
    const el = document.createElement("textarea");
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    alert("✅ Resumen copiado al portapapeles.");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  const S = styles(altoContraste);

  return (
    <div style={S.app}>
      {/* SAVED INDICATOR */}
      <div style={{ ...S.savedIndicator, opacity: savedVisible ? 1 : 0 }}>
        ✓ Guardado
      </div>

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={S.headerTop}>
            <div>
              <div style={S.headerBadge}>Sprint 1 · UX/UI · Semana 2</div>
              <div style={S.headerTitle}>Relevamiento de Campo</div>
              <div style={S.headerSubtitle}>Centro de Formación Profesional N.º 7</div>
            </div>
            <button style={S.btnContraste} onClick={() => setAltoContraste((v) => !v)}>
              {altoContraste ? "☀️" : "🌑"}
            </button>
          </div>
        </div>

        {/* SELECTOR VISITA */}
        <div style={S.visitBar}>
          <span style={S.visitLabel}>Visita</span>
          <select
            style={S.visitSelect}
            value={state.visitaActual}
            onChange={(e) => cambiarVisita(e.target.value)}
          >
            {Object.keys(state.visitas).map((k) => (
              <option key={k} value={k}>Visita {k}</option>
            ))}
          </select>
          <button style={S.btnNewVisit} onClick={nuevaVisita}>+ Nueva</button>
        </div>

        {/* PROGRESS */}
        <div style={S.progressWrap}>
          <div style={S.progressRow}>
            <span>Progreso de la visita</span>
            <span style={{ fontWeight: 700 }}>{progresoPct}% — {totalDone}/{totalItems}</span>
          </div>
          <div style={S.progressTrack}>
            <div style={{ ...S.progressFill, width: `${progresoPct}%` }} />
          </div>
          <div style={S.progressMeta}>
            <span>📷 {totalFotos} foto{totalFotos !== 1 ? "s" : ""}</span>
            <span>📝 {totalNotas} sector{totalNotas !== 1 ? "es" : ""} con notas</span>
            <span>⚠️ {totalBarreras} barrera{totalBarreras !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* CRONÓMETRO */}
        <div style={S.cronoBar}>
          <span style={S.cronoLabel}>⏱ Tiempo:</span>
          <span style={{ ...S.cronoTime, color: (visita.cronoSegundos || 0) > 3600 ? "#FFB347" : "white" }}>
            {formatCrono(visita.cronoSegundos || 0)}
          </span>
          <div style={S.cronoBtns}>
            <button
              style={cronoActivo ? S.btnCronoPause : S.btnCronoStart}
              onClick={() => setCronoActivo((v) => !v)}
            >
              {cronoActivo ? "⏸ Pausar" : (visita.cronoSegundos || 0) > 0 ? "▶ Continuar" : "▶ Iniciar"}
            </button>
            {(visita.cronoSegundos || 0) > 0 && !cronoActivo && (
              <button
                style={S.btnCronoReset}
                onClick={() => { updateVisita((v) => ({ ...v, cronoSegundos: 0 })); }}
              >↺</button>
            )}
          </div>
        </div>

        {/* DATOS VISITA */}
        <div style={S.visitData}>
          <input
            style={S.visitInput}
            type="date"
            value={visita.fecha || ""}
            onChange={(e) => updateVisita((v) => ({ ...v, fecha: e.target.value }))}
          />
          <input
            style={{ ...S.visitInput, flex: 2 }}
            type="text"
            placeholder="👤 Responsable / equipo"
            value={visita.responsable || ""}
            onChange={(e) => updateVisita((v) => ({ ...v, responsable: e.target.value }))}
          />
        </div>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {[
          ["sectores", "📋 Sectores"],
          ["croquis", "🗺 Croquis"],
          ["fotos", "📷 Fotos"],
          ["notas", "📝 Notas"],
          ["comparar", "📊 Comparar"],
        ].map(([id, label]) => (
          <button
            key={id}
            style={{ ...S.tab, ...(tab === id ? S.tabActive : {}) }}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={S.content}>
        {tab === "sectores" && (
          <TabSectores
            visita={visita}
            sectorAbierto={sectorAbierto}
            setSectorAbierto={setSectorAbierto}
            toggleCheck={toggleCheck}
            setCampo={setCampo}
            setSev={setSev}
            setNota={setNota}
            altoContraste={altoContraste}
          />
        )}
        {tab === "croquis" && <TabCroquis altoContraste={altoContraste} />}
        {tab === "fotos" && (
          <TabFotos
            visita={visita}
            onFotoChange={onFotoChange}
            setFotaNota={setFotaNota}
            altoContraste={altoContraste}
          />
        )}
        {tab === "notas" && (
          <TabNotas
            visita={visita}
            visitaNum={state.visitaActual}
            progresoPct={progresoPct}
            totalDone={totalDone}
            totalItems={totalItems}
            totalFotos={totalFotos}
            updateVisita={updateVisita}
            altoContraste={altoContraste}
          />
        )}
        {tab === "comparar" && (
          <TabComparar
            state={state}
            visitaActual={state.visitaActual}
            altoContraste={altoContraste}
          />
        )}
      </div>

      {/* FAB */}
      <button style={S.fab} onClick={exportarResumen}>
        📋 Exportar resumen
      </button>
    </div>
  );
}

// ─── TAB SECTORES ─────────────────────────────────────────────────────────────

function TabSectores({ visita, sectorAbierto, setSectorAbierto, toggleCheck, setCampo, setSev, setNota, altoContraste }) {
  const S = styles(altoContraste);
  return (
    <div>
      {SECTORES.map((sector) => {
        const done = contarChecksVisita(visita, sector.id, sector.checklist.length);
        const pct = Math.round((done / sector.checklist.length) * 100);
        const isOpen = sectorAbierto === sector.id;
        return (
          <div key={sector.id} style={{ ...S.sectorCard, borderColor: isOpen ? sector.color : "transparent" }}>
            <button style={S.sectorHeader} onClick={() => setSectorAbierto(isOpen ? null : sector.id)}>
              <div style={{ ...S.sectorIcon, background: sector.bg }}>{sector.emoji}</div>
              <div style={S.sectorInfo}>
                <div style={S.sectorName}>{sector.titulo}</div>
                <div style={S.sectorDesc}>{sector.desc}</div>
                <div style={S.sectorBarRow}>
                  <div style={S.sectorBarTrack}>
                    <div style={{ ...S.sectorBarFill, width: `${pct}%`, background: sector.color }} />
                  </div>
                  <span style={{ ...S.sectorCount, color: sector.color }}>{done}/{sector.checklist.length}</span>
                </div>
              </div>
              <span style={{ ...S.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </button>

            {isOpen && (
              <div style={S.checklistBody}>
                <hr style={S.divider} />
                {sector.checklist.map((item, i) => {
                  const key = `${sector.id}-${i}`;
                  const checked = !!(visita.checks?.[key]);
                  const campoDef = sector.campos.find((c) => c.idx === i);
                  const sev = visita.severidades?.[key];
                  return (
                    <div key={i} style={S.checkItem}>
                      <button style={S.checkRow} onClick={() => toggleCheck(sector.id, i)}>
                        <div style={{
                          ...S.checkBox,
                          borderColor: checked ? sector.color : "#E5E7EB",
                          background: checked ? sector.color : "transparent",
                        }}>
                          {checked && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
                        </div>
                        <span style={{ ...S.checkLabel, textDecoration: checked ? "line-through" : "none", color: checked ? "#9CA3AF" : "#6B7280" }}>
                          {item}
                        </span>
                      </button>
                      {campoDef && (
                        <div style={S.campoRow}>
                          <span style={S.campoLabel}>{campoDef.label}:</span>
                          <input
                            style={S.campoInput}
                            value={visita.camposValores?.[key] || ""}
                            placeholder={campoDef.placeholder}
                            onChange={(e) => setCampo(sector.id, i, e.target.value)}
                          />
                        </div>
                      )}
                      {sector.severidad && checked && (
                        <div style={S.sevRow}>
                          {[["critica", "🔴 Crítica", "#D93535", "#FEECEC"], ["moderada", "🟡 Moderada", "#D4A10A", "#FFF9E6"], ["leve", "🟢 Leve", "#13B385", "#E1F5EE"]].map(([val, lbl, col, bg]) => (
                            <button
                              key={val}
                              style={{
                                ...S.sevBtn,
                                borderColor: sev === val ? col : "#E5E7EB",
                                background: sev === val ? bg : "transparent",
                                color: sev === val ? col : "#6B7280",
                              }}
                              onClick={() => setSev(sector.id, i, val)}
                            >{lbl}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <textarea
                  style={S.notaTextarea}
                  rows={2}
                  placeholder={`Observaciones sobre ${sector.titulo.toLowerCase()}...`}
                  value={visita.notas?.[sector.id] || ""}
                  onChange={(e) => setNota(sector.id, e.target.value)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TAB CROQUIS ──────────────────────────────────────────────────────────────

function TabCroquis({ altoContraste }) {
  const S = styles(altoContraste);
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>Croquis del Predio</div>
        <div style={S.cardSubtitle}>Referencia para ubicar sectores · Calle Ramsay · Calle Dargones</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {["Vista general", "Vista detallada"].map((lbl) => (
            <div key={lbl}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5, textAlign: "center", fontWeight: 600 }}>{lbl}</div>
              <div style={{ background: "#F0F4F8", borderRadius: 8, height: 110, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E5E7EB" }}>
                <span style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", padding: 8 }}>📷 Agregar foto<br />del edificio</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {[["#1A6FE8","Acceso"],["#13B385","Rampa"],["#E87013","Escalera"],["#7A4FE5","Baño"],["#0BA8BB","Aula"],["#D93535","Barrera"],["#D4A10A","Señalética"],["#5A6470","Circulación"]].map(([col,lbl]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: col, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: altoContraste ? "#ccc" : "#374151" }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={{ ...S.cardTitle, marginBottom: 12 }}>Referencias por sector</div>
        {SECTORES.map((s) => (
          <div key={s.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{s.emoji}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: altoContraste ? "#fff" : "#111" }}>{s.titulo}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB FOTOS ────────────────────────────────────────────────────────────────

function TabFotos({ visita, onFotoChange, setFotaNota, altoContraste }) {
  return (
    <div>
      <div style={{ background: "#EBF2FF", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#1A6FE8", fontWeight: 500 }}>
        📷 Tocá cada tarjeta para capturar o elegir una imagen de cada sector.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {FOTOS_CONFIG.map((f, i) => {
          const hasFoto = !!(visita.fotoData?.[i]);
          return (
            <div key={i} style={{ background: altoContraste ? "#111" : "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `2px solid ${hasFoto ? f.color : "transparent"}` }}>
              <label style={{ display: "block", cursor: "pointer" }}>
                <div style={{ height: 110, background: hasFoto ? "transparent" : f.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                  {hasFoto ? (
                    <>
                      <img src={visita.fotoData[i]} alt={f.label} style={{ width: "100%", height: 110, objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: 6, right: 6, background: f.color, borderRadius: 6, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11 }}>✓</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 5 }}>{f.icon}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center", padding: "0 8px" }}>Tocar para agregar</div>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => onFotoChange(e, i)} />
              </label>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: altoContraste ? "#fff" : "#374151", marginBottom: 4 }}>{f.icon} {f.label}</div>
                <input
                  style={{ width: "100%", fontSize: 11, borderRadius: 6, padding: "5px 8px", border: "1px solid #E5E7EB", background: altoContraste ? "#1a1a1a" : "#F9FAFB", color: altoContraste ? "#fff" : "#374151", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  placeholder="Nota rápida..."
                  value={visita.fotosNotas?.[i] || ""}
                  onChange={(e) => setFotaNota(i, e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAB NOTAS ────────────────────────────────────────────────────────────────

function TabNotas({ visita, visitaNum, progresoPct, totalDone, totalItems, totalFotos, updateVisita, altoContraste }) {
  const S = styles(altoContraste);
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📊 Resumen — Visita {visitaNum}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[["#EBF2FF","#1A6FE8",`${progresoPct}%`,"Progreso"],["#E1F5EE","#13B385",`${totalDone}/${totalItems}`,"Ítems OK"],["#FFF3E8","#E87013",`${totalFotos}/${FOTOS_CONFIG.length}`,"Fotos"]].map(([bg,col,val,lbl]) => (
            <div key={lbl} style={{ background: bg, borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: col }}>{val}</div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
        {SECTORES.map((s) => {
          const d = contarChecksVisita(visita, s.id, s.checklist.length);
          const p = Math.round(d / s.checklist.length * 100);
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: altoContraste ? "#ccc" : "#374151", fontWeight: 500 }}>{s.titulo}</span>
                  <span style={{ color: s.color, fontWeight: 700 }}>{d}/{s.checklist.length}</span>
                </div>
                <div style={{ background: altoContraste ? "#333" : "#F0F2F4", borderRadius: 3, height: 4, overflow: "hidden" }}>
                  <div style={{ width: `${p}%`, height: "100%", background: s.color, borderRadius: 3, transition: "width 0.4s" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>📝 Observaciones Generales</div>
        <textarea
          style={S.notaTextarea}
          rows={5}
          placeholder="Condiciones del día, personas contactadas, contexto general..."
          value={visita.notaGeneral || ""}
          onChange={(e) => updateVisita((v) => ({ ...v, notaGeneral: e.target.value }))}
        />
      </div>

      {SECTORES.filter((s) => visita.notas?.[s.id]).length > 0 && (
        <div style={S.card}>
          <div style={S.cardTitle}>💬 Notas por Sector</div>
          {SECTORES.filter((s) => visita.notas?.[s.id]).map((s) => (
            <div key={s.id} style={{ borderLeft: `3px solid ${s.color}`, paddingLeft: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.emoji} {s.titulo}</div>
              <div style={{ fontSize: 13, color: altoContraste ? "#ccc" : "#374151", lineHeight: 1.5 }}>{visita.notas[s.id]}</div>
            </div>
          ))}
        </div>
      )}

      <div style={S.card}>
        <div style={S.cardTitle}>🚀 Próximos Pasos</div>
        {PROXIMOS_PASOS.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: "8px 10px", background: altoContraste ? "#1a1a1a" : "#F9FAFB", borderRadius: 8 }}>
            <span style={{ color: "#1A6FE8", fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
            <div>
              <div style={{ fontSize: 13, color: altoContraste ? "#ddd" : "#374151" }}>{p.texto}</div>
              <div style={{ fontSize: 10, color: "#1A6FE8", fontWeight: 700, marginTop: 2 }}>{p.rol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB COMPARAR ─────────────────────────────────────────────────────────────

function TabComparar({ state, visitaActual, altoContraste }) {
  const S = styles(altoContraste);
  const visitasKeys = Object.keys(state.visitas);

  if (visitasKeys.length < 2) {
    return (
      <div>
        <div style={{ background: "linear-gradient(135deg,#EBF2FF,#E1F5EE)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid #B5D4F4" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0C447C", marginBottom: 4 }}>📊 Comparación entre visitas</div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>Cuando tengas al menos 2 visitas registradas, aquí vas a poder comparar el avance. Usá el botón "+ Nueva" para crear la próxima visita.</div>
        </div>
        <div style={S.card}>
          <div style={{ ...S.cardTitle, marginBottom: 12 }}>Cómo usar esta función</div>
          {[["📋","Completá el relevamiento de la Visita 1"],["➕","Creá la Visita 2 desde + Nueva en el header"],["🔍","Volvé a relevear en la segunda visita"],["📊","Aquí vas a ver qué mejoró y qué está pendiente"]].map(([e,t]) => (
            <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: "8px 10px", background: altoContraste ? "#1a1a1a" : "#F9FAFB", borderRadius: 8 }}>
              <span style={{ fontSize: 18 }}>{e}</span>
              <div style={{ fontSize: 13, color: altoContraste ? "#ddd" : "#374151" }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#EBF2FF,#E1F5EE)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid #B5D4F4" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0C447C", marginBottom: 2 }}>📊 Comparación entre visitas</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>Verde = mejoró · Rojo = empeoró · Gris = igual</div>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {visitasKeys.map((k) => {
          const visit = state.visitas[k];
          const total = SECTORES.reduce((a, s) => a + s.checklist.length, 0);
          const done = SECTORES.reduce((a, s) => a + contarChecksVisita(visit, s.id, s.checklist.length), 0);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isCurrent = parseInt(k) === visitaActual;
          return (
            <div key={k} style={{ minWidth: 150, background: altoContraste ? "#111" : "#fff", borderRadius: 14, padding: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `2px solid ${isCurrent ? "#1A6FE8" : "transparent"}`, flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: isCurrent ? "#1A6FE8" : "#6B7280", marginBottom: 6 }}>
                Visita {k} {isCurrent ? "← actual" : ""}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1A6FE8" }}>{pct}%</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{done}/{total} ítems</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>{visit.fecha || "Sin fecha"}</div>
              <div style={{ background: "#F0F4F8", borderRadius: 4, height: 4, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#1A6FE8", borderRadius: 4, width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.card}>
        <div style={{ ...S.cardTitle, marginBottom: 14 }}>Detalle por sector</div>
        {SECTORES.map((s) => (
          <div key={s.id} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: altoContraste ? "#fff" : "#111", marginBottom: 6 }}>{s.emoji} {s.titulo}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {visitasKeys.map((k, idx) => {
                const visit = state.visitas[k];
                const done = contarChecksVisita(visit, s.id, s.checklist.length);
                const pct = Math.round((done / s.checklist.length) * 100);
                let color = s.color;
                let delta = "";
                if (idx > 0) {
                  const prev = state.visitas[visitasKeys[idx - 1]];
                  const prevDone = contarChecksVisita(prev, s.id, s.checklist.length);
                  const diff = done - prevDone;
                  if (diff > 0) { color = "#13B385"; delta = ` ↑${diff}`; }
                  else if (diff < 0) { color = "#D93535"; delta = ` ↓${Math.abs(diff)}`; }
                  else { color = "#9CA3AF"; delta = " →"; }
                }
                return (
                  <div key={k} style={{ background: `${color}18`, borderRadius: 6, padding: "5px 10px", border: `1px solid ${color}30` }}>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>V{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color }}>{pct}%{delta}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────

function styles(dark) {
  const surface = dark ? "#111" : "#ffffff";
  const bg = dark ? "#000" : "#F4F6F9";
  const text = dark ? "#ffffff" : "#111827";
  const text2 = dark ? "#aaaaaa" : "#6B7280";
  const border = dark ? "#333333" : "#E5E7EB";
  const inputBg = dark ? "#1a1a1a" : "#F9FAFB";
  const font = "'DM Sans', -apple-system, sans-serif";

  return {
    app: { fontFamily: font, background: bg, color: text, minHeight: "100vh", paddingBottom: 100 },
    savedIndicator: { position: "fixed", top: 10, right: 10, background: "#13B385", color: "white", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, zIndex: 200, pointerEvents: "none", transition: "opacity 0.3s" },
    header: { background: "linear-gradient(135deg,#0C447C 0%,#1A6FE8 60%,#13B385 100%)", color: "white" },
    headerInner: { padding: "16px 20px 0" },
    headerTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    headerBadge: { fontSize: 10, fontWeight: 700, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase", marginBottom: 4 },
    headerTitle: { fontSize: 20, fontWeight: 700, lineHeight: 1.2 },
    headerSubtitle: { fontSize: 12, opacity: 0.8, marginTop: 2 },
    btnContraste: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 8, padding: "8px 10px", fontSize: 16, cursor: "pointer", flexShrink: 0 },
    visitBar: { background: "rgba(0,0,0,0.2)", padding: "10px 20px", display: "flex", alignItems: "center", gap: 10 },
    visitLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, opacity: 0.7, whiteSpace: "nowrap" },
    visitSelect: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 6, padding: "4px 8px", fontSize: 13, fontFamily: font, fontWeight: 600, cursor: "pointer", flex: 1 },
    btnNewVisit: { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: font },
    progressWrap: { background: "rgba(255,255,255,0.15)", padding: "10px 20px 14px" },
    progressRow: { display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.85, marginBottom: 6 },
    progressTrack: { background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 6, overflow: "hidden" },
    progressFill: { height: "100%", background: "#5AFFB4", borderRadius: 4, transition: "width 0.4s" },
    progressMeta: { display: "flex", gap: 14, marginTop: 7, fontSize: 11, opacity: 0.7 },
    cronoBar: { background: "rgba(0,0,0,0.15)", padding: "9px 20px", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid rgba(255,255,255,0.1)" },
    cronoLabel: { fontSize: 12, opacity: 0.75 },
    cronoTime: { fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, letterSpacing: 1 },
    cronoBtns: { display: "flex", gap: 6, marginLeft: "auto" },
    btnCronoStart: { background: "#5AFFB4", color: "#000", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font },
    btnCronoPause: { background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font },
    btnCronoReset: { background: "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 14, cursor: "pointer", fontFamily: font },
    visitData: { padding: "0 20px 14px", display: "flex", gap: 8, flexWrap: "wrap" },
    visitInput: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 13, fontFamily: font, outline: "none", flex: 1, minWidth: 130 },
    tabs: { background: surface, borderBottom: `1px solid ${border}`, display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch" },
    tab: { border: "none", background: "transparent", padding: "14px 16px", fontSize: 13, fontWeight: 600, fontFamily: font, cursor: "pointer", whiteSpace: "nowrap", color: text2, borderBottom: "2px solid transparent" },
    tabActive: { color: "#1A6FE8", borderBottomColor: "#1A6FE8" },
    content: { padding: "16px 16px 20px" },
    card: { background: surface, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 16, border: `1px solid ${border}` },
    cardTitle: { fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 },
    cardSubtitle: { fontSize: 12, color: text2, marginBottom: 14 },
    sectorCard: { background: surface, borderRadius: 14, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden", border: "2px solid transparent", transition: "border 0.2s" },
    sectorHeader: { width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left", fontFamily: font },
    sectorIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
    sectorInfo: { flex: 1, minWidth: 0 },
    sectorName: { fontWeight: 700, fontSize: 14, color: text, marginBottom: 2 },
    sectorDesc: { fontSize: 11, color: text2, marginBottom: 5 },
    sectorBarRow: { display: "flex", alignItems: "center", gap: 8 },
    sectorBarTrack: { flex: 1, height: 4, borderRadius: 3, background: dark ? "#333" : "#F0F2F4", overflow: "hidden" },
    sectorBarFill: { height: "100%", borderRadius: 3, transition: "width 0.4s" },
    sectorCount: { fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" },
    chevron: { fontSize: 14, color: text2, flexShrink: 0, transition: "transform 0.2s", display: "inline-block" },
    checklistBody: { padding: "0 16px 16px" },
    divider: { border: "none", borderTop: `1px solid ${border}`, marginBottom: 12 },
    checkItem: { borderBottom: `1px solid ${dark ? "#222" : "#F4F6F9"}`, paddingBottom: 8, marginBottom: 8 },
    checkRow: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "4px 0", border: "none", background: "transparent", width: "100%", textAlign: "left", fontFamily: font },
    checkBox: { width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
    checkLabel: { fontSize: 13, lineHeight: 1.5, transition: "all 0.2s" },
    campoRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 6, marginLeft: 32 },
    campoLabel: { fontSize: 11, color: text2 },
    campoInput: { border: `1px solid ${border}`, borderRadius: 6, padding: "4px 8px", fontSize: 13, fontWeight: 600, background: inputBg, color: text, outline: "none", width: 120, fontFamily: font },
    sevRow: { display: "flex", gap: 6, marginTop: 6, marginLeft: 32, flexWrap: "wrap" },
    sevBtn: { border: "1.5px solid", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: font, transition: "all 0.15s" },
    notaTextarea: { width: "100%", borderRadius: 8, padding: "10px 12px", fontSize: 13, resize: "vertical", outline: "none", border: `1px solid ${border}`, background: inputBg, color: text, fontFamily: font, marginTop: 8, boxSizing: "border-box" },
    fab: { position: "fixed", bottom: 24, right: 20, background: "linear-gradient(135deg,#1A6FE8,#13B385)", color: "white", border: "none", borderRadius: 16, padding: "14px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(26,111,232,0.4)", display: "flex", alignItems: "center", gap: 8, zIndex: 100, fontFamily: font },
  };
}
