import { useState, useEffect, useRef } from "react";

// ─── DATOS DEL RELEVAMIENTO ───────────────────────────────────────────────────

const SECTORES = [
  {
    id: "accesos",
    emoji: "🚪",
    color: "#1A6FE8",
    bg: "#EBF2FF",
    titulo: "Accesos al Edificio",
    desc: "Entradas principales y secundarias del predio",
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
  },
  {
    id: "rampas",
    emoji: "♿",
    color: "#13B385",
    bg: "#E6F9F4",
    titulo: "Rampas y Accesibilidad Motriz",
    desc: "Rampas, nivelaciones y circulación en silla de ruedas",
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
  },
  {
    id: "escaleras",
    emoji: "🪜",
    color: "#E87013",
    bg: "#FFF3E8",
    titulo: "Escaleras",
    desc: "Escaleras internas y externas del edificio",
    checklist: [
      "Cantidad de escaleras",
      "Pasamanos en ambos lados",
      "Pasamanos continuo (sin interrupciones)",
      "Primer y último escalón diferenciado (color/textura)",
      "Iluminación adecuada en todo el tramo",
      "Superficie antideslizante en peldaños",
      "Señalética de piso y cartelería visible",
      "Contrahuella cerrada (sin huecos)",
    ],
    campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 3" }],
  },
  {
    id: "banios",
    emoji: "🚻",
    color: "#7A4FE5",
    bg: "#F2EEFF",
    titulo: "Baños",
    desc: "Sanitarios accesibles e inclusivos",
    checklist: [
      "Cantidad de baños",
      "Baño accesible / adaptado disponible",
      "Señalética exterior clara e inclusiva",
      "Puerta con ancho ≥ 80 cm",
      "Espacio de giro interior ≥ 150 cm",
      "Barras de apoyo junto al inodoro",
      "Inodoro a altura entre 45 y 50 cm",
      "Lavabo con espacio libre inferior (silla de ruedas)",
      "Estado general limpio y funcional",
    ],
    campos: [
      { idx: 0, label: "Cantidad", placeholder: "ej: 4" },
    ],
  },
  {
    id: "aulas",
    emoji: "🏫",
    color: "#0BA8BB",
    bg: "#E6F8FA",
    titulo: "Aulas y Salones",
    desc: "Espacios de formación y actividad",
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
  },
  {
    id: "circulacion",
    emoji: "🛤️",
    color: "#5A6470",
    bg: "#F0F2F4",
    titulo: "Pasillos y Circulación",
    desc: "Corredores, patios y espacios de tránsito",
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
  },
  {
    id: "senaletica",
    emoji: "🗺️",
    color: "#D4A10A",
    bg: "#FFF9E6",
    titulo: "Señalética y Orientación",
    desc: "Carteles, íconos y referencias visuales",
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
  },
  {
    id: "barreras",
    emoji: "⚠️",
    color: "#D93535",
    bg: "#FEECEC",
    titulo: "Barreras e Incidencias",
    desc: "Obstáculos físicos, comunicacionales y actitudinales",
    severidad: true,
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
  },
];

const FOTOS = [
  { label: "Acceso principal",        color: "#1A6FE8", icon: "🚪" },
  { label: "Rampa accesible",         color: "#13B385", icon: "♿" },
  { label: "Escalera",                color: "#E87013", icon: "🪜" },
  { label: "Baño accesible",          color: "#7A4FE5", icon: "🚻" },
  { label: "Aula / Salón",            color: "#0BA8BB", icon: "🏫" },
  { label: "Barrera detectada",       color: "#D93535", icon: "⚠️" },
  { label: "Señalética",              color: "#D4A10A", icon: "🗺️" },
  { label: "Patio / Circulación",     color: "#5A6470", icon: "🛤️" },
  { label: "Vista fachada",           color: "#1A3A6E", icon: "🏢" },
  { label: "Otro",                    color: "#9CA3AF", icon: "📌" },
];

const PROXIMOS_PASOS = [
  { texto: "Volcar datos en planilla compartida (Google Sheets)", rol: "Data" },
  { texto: "Subir fotos al Drive del equipo organizadas por sector", rol: "UX/UI" },
  { texto: "Documentar hallazgos en el tablero Notion del proyecto", rol: "Todos" },
  { texto: "Definir sectores críticos para priorizar en el mapa SVG", rol: "UX/UI + Front" },
  { texto: "Registrar coordenadas aproximadas de cada espacio en el plano", rol: "Front" },
  { texto: "Armar fichas descriptivas de cada sector con los datos relevados", rol: "UX/UI" },
  { texto: "Reportar barreras detectadas al sistema colaborativo", rol: "QA + Todos" },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

function Relevamiento() {
  const [checks, setChecks] = useState({});
  const [notas, setNotas] = useState({});
  const [general, setGeneral] = useState("");
  const [fecha, setFecha] = useState("");
  const [responsable, setResponsable] = useState("");
  const [activeTab, setActiveTab] = useState("sectores");
  const [fotosPreviews, setFotosPreviews] = useState({});
  const [fotosNotas, setFotosNotas] = useState({});
  const [expandedSector, setExpandedSector] = useState(null);
  const [altoContraste, setAltoContraste] = useState(false);
  const [camposValores, setCamposValores] = useState({});
  const [severidades, setSeveridades] = useState({});
  const [cronActivo, setCronActivo] = useState(false);
  const [cronSegundos, setCronSegundos] = useState(0);
  const cronRef = useRef(null);

  useEffect(() => {
    if (cronActivo) {
      cronRef.current = setInterval(() => setCronSegundos(s => s + 1), 1000);
    } else {
      clearInterval(cronRef.current);
    }
    return () => clearInterval(cronRef.current);
  }, [cronActivo]);

  // ─── PERSISTENCIA DE DATOS (LOCALSTORAGE) ───────────────────────────────────
  useEffect(() => {
    const dataGuardada = localStorage.getItem("cfp7-relevamiento-draft");
    if (dataGuardada) {
      try {
        const parsed = JSON.parse(dataGuardada);
        if (parsed.checks) setChecks(parsed.checks);
        if (parsed.notas) setNotas(parsed.notas);
        if (parsed.general) setGeneral(parsed.general);
        if (parsed.fecha) setFecha(parsed.fecha);
        if (parsed.responsable) setResponsable(parsed.responsable);
        if (parsed.camposValores) setCamposValores(parsed.camposValores);
        if (parsed.severidades) setSeveridades(parsed.severidades);
        if (parsed.fotosNotas) setFotosNotas(parsed.fotosNotas);
        if (parsed.cronSegundos) setCronSegundos(parsed.cronSegundos);
      } catch (e) {
        console.error("Error al recuperar datos guardados", e);
      }
    }
  }, []);

  useEffect(() => {
    const dataParaGuardar = {
      checks, notas, general, fecha, responsable, 
      camposValores, severidades, fotosNotas, cronSegundos
    };
    localStorage.setItem("cfp7-relevamiento-draft", JSON.stringify(dataParaGuardar));
  }, [checks, notas, general, fecha, responsable, camposValores, severidades, fotosNotas, cronSegundos]);

  const limpiarRelevamiento = () => {
    if (window.confirm("¿Seguro que querés limpiar todos los datos? Empezarás un relevamiento desde cero.")) {
      localStorage.removeItem("cfp7-relevamiento-draft");
      setChecks({});
      setNotas({});
      setGeneral("");
      setFecha("");
      setResponsable("");
      setCamposValores({});
      setSeveridades({});
      setFotosNotas({});
      setFotosPreviews({});
      setCronSegundos(0);
      setCronActivo(false);
    }
  };

  const formatCron = (seg) => {
    const h = Math.floor(seg / 3600);
    const m = Math.floor((seg % 3600) / 60);
    const s = seg % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
      : `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const setCampo = (sectorId, idx, val) =>
    setCamposValores(prev => ({ ...prev, [`${sectorId}-${idx}`]: val }));

  const setSeveridad = (sectorId, idx, val) =>
    setSeveridades(prev => ({ ...prev, [`${sectorId}-${idx}`]: val }));

  const toggle = (sectorId, idx) => {
    const key = `${sectorId}-${idx}`;
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setNota = (id, val) => setNotas(prev => ({ ...prev, [id]: val }));

  const completedCount = (sectorId, len) =>
    Array.from({ length: len }, (_, i) => checks[`${sectorId}-${i}`]).filter(Boolean).length;

  const totalItems = SECTORES.reduce((acc, s) => acc + s.checklist.length, 0);
  const totalChecked = SECTORES.reduce(
    (acc, s) => acc + completedCount(s.id, s.checklist.length), 0
  );
  const progreso = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  const fotosCount = Object.keys(fotosPreviews).length;

  // ── EXPORTAR RELEVAMIENTO ────────────────────────────────────────────────
  const exportarResumen = () => {
    const linea = (txt) => txt + "\n";
    const sep = "─".repeat(40) + "\n";

    let txt = "";
    txt += linea("╔══════════════════════════════════════╗");
    txt += linea("  RELEVAMIENTO DE CAMPO — CFP N.º 7");
    txt += linea("  Sprint 1 · UX/UI · Semana 2");
    txt += linea("╚══════════════════════════════════════╝");
    txt += linea("");
    if (fecha)       txt += linea(`📅 Fecha:        ${fecha}`);
    if (responsable) txt += linea(`👤 Equipo:       ${responsable}`);
    txt += linea(`⏱ Duración:     ${formatCron(cronSegundos)}`);
    txt += linea(`📊 Progreso:     ${progreso}% (${totalChecked}/${totalItems} ítems)`);
    txt += linea(`📷 Fotos:        ${fotosCount}/${FOTOS.length}`);
    txt += linea("");

    SECTORES.forEach(s => {
      const done = completedCount(s.id, s.checklist.length);
      txt += sep;
      txt += linea(`${s.emoji} ${s.titulo.toUpperCase()} — ${done}/${s.checklist.length}`);
      s.checklist.forEach((item, i) => {
        const marcado = checks[`${s.id}-${i}`];
        const campo = camposValores[`${s.id}-${i}`];
        const sev = s.severidad && severidades[`${s.id}-${i}`];
        const sevLabel = sev === "critica" ? " 🔴 CRÍTICA" : sev === "moderada" ? " 🟡 MODERADA" : sev === "leve" ? " 🟢 LEVE" : "";
        const campoLabel = campo ? ` → ${campo}` : "";
        txt += linea(`  ${marcado ? "✅" : "⬜"} ${item}${campoLabel}${sevLabel}`);
      });
      if (notas[s.id]) {
        txt += linea(`  📝 Nota: ${notas[s.id]}`);
      }
      txt += linea("");
    });

    txt += sep;
    txt += linea("📷 FOTOS TOMADAS");
    FOTOS.forEach((f, i) => {
      const tiene = !!fotosPreviews[i];
      txt += linea(`  ${tiene ? "✅" : "⬜"} ${f.icon} ${f.label}${fotosNotas[i] ? " — " + fotosNotas[i] : ""}`);
    });
    txt += linea("");

    if (general) {
      txt += sep;
      txt += linea("📝 OBSERVACIONES GENERALES");
      txt += linea(general);
      txt += linea("");
    }

    txt += sep;
    txt += linea("🚀 PRÓXIMOS PASOS");
    PROXIMOS_PASOS.forEach(p => {
      txt += linea(`  → [${p.rol}] ${p.texto}`);
    });
    txt += linea("");
    txt += linea(`Generado: ${new Date().toLocaleString("es-AR")}`);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => {
        alert("✅ Resumen copiado al portapapeles.\nPegalo en WhatsApp, Notion o Google Sheets.");
      }).catch(() => fallbackCopy(txt));
    } else {
      fallbackCopy(txt);
    }
  };

  const fallbackCopy = (txt) => {
    const el = document.createElement("textarea");
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    alert("✅ Resumen copiado al portapapeles.\nPegalo en WhatsApp, Notion o Google Sheets.");
  };

  const bgApp = altoContraste ? "#000" : "#F4F6F9";

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: bgApp, minHeight: "100vh", transition: "background 0.3s" }}>

      {/* HEADER */}
      <div style={{
        background: altoContraste
          ? "#000"
          : "linear-gradient(135deg, #1A3A6E 0%, #1A6FE8 100%)",
        padding: "28px 20px 20px",
        color: "#fff",
        borderBottom: altoContraste ? "3px solid #fff" : "none",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, opacity: 0.7, marginBottom: 6 }}>
              SPRINT 1 · UX/UI · SEMANA 2
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>
              Relevamiento de Campo
            </div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Centro de Formación Profesional N.º 7
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={limpiarRelevamiento}
              title="Nuevo relevamiento"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              🗑️
            </button>
            <button
              onClick={() => setAltoContraste(v => !v)}
              title="Modo alto contraste"
              style={{
                background: altoContraste ? "#fff" : "rgba(255,255,255,0.2)",
                color: altoContraste ? "#000" : "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {altoContraste ? "☀️" : "🌑"}
            </button>
          </div>
        </div>

        {/* Progreso global */}
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, opacity: 0.9 }}>
            <span>Progreso total del relevamiento</span>
            <span style={{ fontWeight: 700 }}>{progreso}% — {totalChecked}/{totalItems}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${progreso}%`, height: "100%", background: "#5AFFB4", borderRadius: 4, transition: "width 0.4s" }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.75, display: "flex", gap: 16 }}>
            <span>📷 {fotosCount} foto{fotosCount !== 1 ? "s" : ""}</span>
            <span>📝 {Object.keys(notas).filter(k => notas[k]).length} sector{Object.keys(notas).filter(k => notas[k]).length !== 1 ? "es" : ""} con notas</span>
          </div>
        </div>

        {/* Cronómetro de visita */}
        <div style={{
          marginTop: 10,
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "8px 14px",
        }}>
          <span style={{ fontSize: 13, opacity: 0.85 }}>⏱ Tiempo de visita:</span>
          <span style={{
            fontSize: 18, fontWeight: 800, letterSpacing: 1,
            fontVariantNumeric: "tabular-nums",
            color: cronSegundos > 3600 ? "#FFB347" : "#fff",
          }}>
            {formatCron(cronSegundos)}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button
              onClick={() => setCronActivo(v => !v)}
              style={{
                background: cronActivo ? "rgba(255,255,255,0.25)" : "#5AFFB4",
                color: cronActivo ? "#fff" : "#000",
                border: "none", borderRadius: 8,
                padding: "5px 12px", fontSize: 12, fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {cronActivo ? "⏸ Pausar" : cronSegundos > 0 ? "▶ Continuar" : "▶ Iniciar"}
            </button>
            {cronSegundos > 0 && !cronActivo && (
              <button
                onClick={() => { setCronSegundos(0); setCronActivo(false); }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff", border: "none", borderRadius: 8,
                  padding: "5px 10px", fontSize: 12, cursor: "pointer",
                }}
              >
                ↺
              </button>
            )}
          </div>
        </div>

        {/* Datos de la visita */}
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <input
            placeholder="📅 Fecha de visita"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13,
              outline: "none", flex: 1, minWidth: 140,
            }}
          />
          <input
            placeholder="👤 Responsable / equipo"
            value={responsable}
            onChange={e => setResponsable(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13,
              outline: "none", flex: 2, minWidth: 180,
            }}
          />
        </div>
      </div>

      {/* TABS */}
      <div style={{
        background: altoContraste ? "#111" : "#fff",
        borderBottom: `1px solid ${altoContraste ? "#555" : "#E4E7EC"}`,
        display: "flex", overflowX: "auto",
      }}>
        {[
          { id: "sectores", label: "📋 Sectores" },
          { id: "croquis",  label: "🗺 Croquis" },
          { id: "fotos",    label: "📷 Fotos" },
          { id: "notas",    label: "📝 Notas" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              border: "none",
              background: "transparent",
              padding: "14px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              color: activeTab === tab.id ? "#1A6FE8" : (altoContraste ? "#aaa" : "#6B7280"),
              borderBottom: activeTab === tab.id ? "2px solid #1A6FE8" : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: "16px 16px 100px" }}>

        {/* ── TAB SECTORES ── */}
        {activeTab === "sectores" && (
          <div>
            {SECTORES.map(sector => {
              const done = completedCount(sector.id, sector.checklist.length);
              const total = sector.checklist.length;
              const pct = Math.round((done / total) * 100);
              const isOpen = expandedSector === sector.id;

              return (
                <div key={sector.id} style={{
                  background: altoContraste ? "#111" : "#fff",
                  borderRadius: 14,
                  marginBottom: 12,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  border: isOpen ? `2px solid ${sector.color}` : "2px solid transparent",
                  transition: "border 0.2s",
                }}>
                  {/* Header del sector */}
                  <button
                    onClick={() => setExpandedSector(isOpen ? null : sector.id)}
                    style={{
                      width: "100%", background: "transparent", border: "none",
                      cursor: "pointer", padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 12,
                      textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: sector.bg, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}>
                      {sector.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: altoContraste ? "#fff" : "#111", marginBottom: 2 }}>
                        {sector.titulo}
                      </div>
                      <div style={{ fontSize: 11, color: altoContraste ? "#aaa" : "#6B7280" }}>
                        {sector.desc}
                      </div>
                      {/* Barra de progreso del sector */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                        <div style={{ flex: 1, background: altoContraste ? "#333" : "#F0F2F4", borderRadius: 3, height: 4, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: sector.color, borderRadius: 3, transition: "width 0.4s" }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: sector.color, whiteSpace: "nowrap" }}>
                          {done}/{total}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 18, color: altoContraste ? "#fff" : "#9CA3AF", flexShrink: 0 }}>
                      {isOpen ? "▲" : "▼"}
                    </div>
                  </button>

                  {/* Checklist expandido */}
                  {isOpen && (
                    <div style={{ padding: "0 16px 16px" }}>
                      <div style={{ borderTop: `1px solid ${altoContraste ? "#333" : "#F0F2F4"}`, paddingTop: 12, marginBottom: 12 }}>
                        {sector.checklist.map((item, i) => {
                          const key = `${sector.id}-${i}`;
                          const checked = !!checks[key];
                          const campoDef = (sector.campos || []).find(c => c.idx === i);
                          const sev = severidades[key];
                          return (
                            <div key={i} style={{
                              borderBottom: `1px solid ${altoContraste ? "#222" : "#F4F6F9"}`,
                              paddingBottom: 8, marginBottom: 8,
                            }}>
                              <button
                                onClick={() => toggle(sector.id, i)}
                                style={{
                                  width: "100%", background: "transparent", border: "none",
                                  cursor: "pointer", display: "flex", alignItems: "flex-start",
                                  gap: 10, padding: "4px 0", textAlign: "left",
                                }}
                              >
                                <div style={{
                                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                                  background: checked ? sector.color : "transparent",
                                  border: `2px solid ${checked ? sector.color : (altoContraste ? "#666" : "#D1D5DB")}`,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.2s",
                                }}>
                                  {checked && <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>✓</span>}
                                </div>
                                <span style={{
                                  fontSize: 13, lineHeight: 1.5,
                                  color: altoContraste ? (checked ? "#fff" : "#aaa") : (checked ? "#374151" : "#6B7280"),
                                  textDecoration: checked ? "line-through" : "none",
                                  fontWeight: checked ? 500 : 400,
                                }}>
                                  {item}
                                </span>
                              </button>

                              {/* Campo numérico/texto inline */}
                              {campoDef && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, marginLeft: 32 }}>
                                  <span style={{ fontSize: 11, color: "#6B7280" }}>{campoDef.label}:</span>
                                  <input
                                    value={camposValores[key] || ""}
                                    onChange={e => setCampo(sector.id, i, e.target.value)}
                                    placeholder={campoDef.placeholder}
                                    style={{
                                      border: `1px solid ${altoContraste ? "#555" : "#D1D5DB"}`,
                                      borderRadius: 6, padding: "4px 8px",
                                      fontSize: 13, fontWeight: 600,
                                      background: altoContraste ? "#1a1a1a" : "#F9FAFB",
                                      color: altoContraste ? "#fff" : "#111",
                                      outline: "none", width: 120,
                                    }}
                                  />
                                </div>
                              )}

                              {/* Severidad (solo sector barreras, cuando está marcado) */}
                              {sector.severidad && checked && (
                                <div style={{ display: "flex", gap: 6, marginTop: 6, marginLeft: 32, flexWrap: "wrap" }}>
                                  {[
                                    { val: "critica",  label: "🔴 Crítica",  bg: "#FEECEC", col: "#D93535" },
                                    { val: "moderada", label: "🟡 Moderada", bg: "#FFF9E6", col: "#D4A10A" },
                                    { val: "leve",     label: "🟢 Leve",     bg: "#E6F9F4", col: "#13B385" },
                                  ].map(op => (
                                    <button
                                      key={op.val}
                                      onClick={() => setSeveridad(sector.id, i, sev === op.val ? null : op.val)}
                                      style={{
                                        border: `1.5px solid ${sev === op.val ? op.col : (altoContraste ? "#444" : "#E5E7EB")}`,
                                        borderRadius: 8,
                                        padding: "3px 10px",
                                        fontSize: 11, fontWeight: 700,
                                        background: sev === op.val ? op.bg : "transparent",
                                        color: sev === op.val ? op.col : (altoContraste ? "#aaa" : "#6B7280"),
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                      }}
                                    >
                                      {op.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <textarea
                        rows={2}
                        placeholder={`Observaciones sobre ${sector.titulo.toLowerCase()}...`}
                        value={notas[sector.id] || ""}
                        onChange={e => setNota(sector.id, e.target.value)}
                        style={{
                          width: "100%", borderRadius: 8, padding: "10px 12px",
                          fontSize: 13, resize: "vertical", outline: "none",
                          border: `1px solid ${altoContraste ? "#555" : "#E5E7EB"}`,
                          background: altoContraste ? "#1a1a1a" : "#F9FAFB",
                          color: altoContraste ? "#fff" : "#374151",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB CROQUIS ── */}
        {activeTab === "croquis" && (
          <div>
            <div style={{
              background: altoContraste ? "#111" : "#fff",
              borderRadius: 14, padding: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 16,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: altoContraste ? "#fff" : "#111", marginBottom: 4 }}>
                Croquis del Predio
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>
                Referencia para ubicar sectores durante la visita · Calle Ramsay · Calle Dargones
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6, textAlign: "center", fontWeight: 600 }}>Vista general</div>
                  <img
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAPiBXwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK