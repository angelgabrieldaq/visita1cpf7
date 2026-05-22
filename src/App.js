import { useState, useEffect, useRef } from "react";

// ─── DATOS DEL RELEVAMIENTO ───────────────────────────────────────────────────
const SECTORES = [
  { id: "accesos", emoji: "🚪", color: "#1A6FE8", bg: "#EBF2FF", titulo: "Accesos al Edificio", desc: "Entradas principales y secundarias del predio", checklist: ["Cantidad de accesos", "Acceso principal con señalización visible", "Sin escalón ni desnivel en la entrada", "Ancho de puerta ≥ 90 cm (silla de ruedas)", "Puerta de fácil apertura (manija tipo palanca)", "Timbre o intercomunicador accesible (h ≤ 120 cm)", "Piso antideslizante en umbral", "Buena iluminación en acceso"], campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 2" }] },
  { id: "rampas", emoji: "♿", color: "#13B385", bg: "#E6F9F4", titulo: "Rampas y Accesibilidad Motriz", desc: "Rampas, nivelaciones y circulación en silla de ruedas", checklist: ["Ubicación de rampa/s", "Pendiente adecuada (≤ 8%)", "Ancho mínimo ≥ 90 cm", "Pasamanos presente en ambos lados", "Superficie antideslizante en buen estado", "Señalización visible en pavimento", "Espacio de maniobra al inicio y fin (≥ 150 cm)", "Sin obstáculos en la rampa"], campos: [{ idx: 0, label: "Ubicación", placeholder: "ej: sector norte" }] },
  { id: "escaleras", emoji: "🪜", color: "#E87013", bg: "#FFF3E8", titulo: "Escaleras", desc: "Escaleras internas y externas del edificio", checklist: ["Cantidad de escaleras", "Pasamanos en ambos lados", "Pasamanos continuo (sin interrupciones)", "Primer y último escalón diferenciado (color/textura)", "Iluminación adecuada en todo el tramo", "Superficie antideslizante en peldaños", "Señalética de piso y cartelería visible", "Contrahuella cerrada (sin huecos)"], campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 3" }] },
  { id: "banios", emoji: "🚻", color: "#7A4FE5", bg: "#F2EEFF", titulo: "Baños", desc: "Sanitarios accesibles e inclusivos", checklist: ["Cantidad de baños", "Baño accesible / adaptado disponible", "Señalética exterior clara e inclusiva", "Puerta con ancho ≥ 80 cm", "Espacio de giro interior ≥ 150 cm", "Barras de apoyo junto al inodoro", "Inodoro a altura entre 45 y 50 cm", "Lavabo con espacio libre inferior (silla de ruedas)", "Estado general limpio y funcional"], campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 4" }] },
  { id: "aulas", emoji: "🏫", color: "#0BA8BB", bg: "#E6F8FA", titulo: "Aulas y Salones", desc: "Espacios de formación y actividad", checklist: ["Número / identificación visible en puerta", "Señalética legible (tipografía grande, contraste)", "Acceso sin obstáculos en el pasillo", "Iluminación suficiente interior", "Espacio entre bancos para circulación ≥ 90 cm", "Visibilidad del pizarrón desde todos los ángulos", "Capacidad aproximada (personas)", "Ventilación adecuada"], campos: [{ idx: 6, label: "Capacidad", placeholder: "ej: 30" }] },
  { id: "circulacion", emoji: "🛤️", color: "#5A6470", bg: "#F0F2F4", titulo: "Pasillos y Circulación", desc: "Corredores, patios y espacios de tránsito", checklist: ["Ancho de pasillo ≥ 120 cm", "Sin obstáculos en la circulación principal", "Piso en buen estado (sin irregularidades)", "Señalética de emergencia visible", "Salidas de emergencia señalizadas", "Iluminación uniforme en todo el recorrido", "Patio interno accesible (sin escalones)"], campos: [] },
  { id: "senaletica", emoji: "🗺️", color: "#D4A10A", bg: "#FFF9E6", titulo: "Señalética y Orientación", desc: "Carteles, íconos y referencias visuales", checklist: ["Cartelería general legible (contraste y tamaño)", "Mapa o plano del edificio visible en entrada", "Señalética en Braille presente", "Pictogramas o íconos comprensibles", "Numeración de aulas visible desde el pasillo", "Indicadores de recorrido de emergencia", "Información en lenguaje sencillo"], campos: [] },
  { id: "barreras", emoji: "⚠️", color: "#D93535", bg: "#FEECEC", titulo: "Barreras e Incidencias", desc: "Obstáculos físicos, comunicacionales y actitudinales", severidad: true, checklist: ["Obstáculos en pasillos o accesos", "Señalética dañada, ausente o ilegible", "Puertas difíciles de abrir o sin rampa", "Pisos irregulares, rotos o resbaladizos", "Falta de iluminación en zonas de tránsito", "Barreras comunicacionales (falta de información)", "Barreras actitudinales observadas", "Otros obstáculos (describir en notas)"], campos: [] },
];

const FOTOS = [
  { label: "Acceso", color: "#1A6FE8", icon: "🚪" }, { label: "Rampa", color: "#13B385", icon: "♿" },
  { label: "Escalera", color: "#E87013", icon: "🪜" }, { label: "Baño", color: "#7A4FE5", icon: "🚻" },
  { label: "Aula", color: "#0BA8BB", icon: "🏫" }, { label: "Barrera", color: "#D93535", icon: "⚠️" },
  { label: "Señalética", color: "#D4A10A", icon: "🗺️" }, { label: "Circulación", color: "#5A6470", icon: "🛤️" }
];

const PROXIMOS_PASOS = [
  { texto: "Volcar datos en planilla compartida", rol: "Data" },
  { texto: "Subir fotos al Drive", rol: "UX/UI" },
  { texto: "Documentar hallazgos en Notion", rol: "Todos" }
];

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
    if (cronActivo) cronRef.current = setInterval(() => setCronSegundos(s => s + 1), 1000);
    else clearInterval(cronRef.current);
    return () => clearInterval(cronRef.current);
  }, [cronActivo]);

  useEffect(() => {
    const data = localStorage.getItem("cfp7-draft");
    if (data) {
      try {
        const p = JSON.parse(data);
        if(p.checks) setChecks(p.checks);
        if(p.notas) setNotas(p.notas);
        if(p.general) setGeneral(p.general);
        if(p.fecha) setFecha(p.fecha);
        if(p.responsable) setResponsable(p.responsable);
        if(p.campos) setCamposValores(p.campos);
        if(p.sev) setSeveridades(p.sev);
        if(p.time) setCronSegundos(p.time);
      } catch(e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cfp7-draft", JSON.stringify({checks, notas, general, fecha, responsable, campos: camposValores, sev: severidades, time: cronSegundos}));
  }, [checks, notas, general, fecha, responsable, camposValores, severidades, cronSegundos]);

  const limpiar = () => {
    if (window.confirm("¿Limpiar todo el relevamiento?")) {
      localStorage.removeItem("cfp7-draft");
      window.location.reload();
    }
  };

  const formatCron = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const completedCount = (sId, len) => Array.from({ length: len }, (_, i) => checks[`${sId}-${i}`]).filter(Boolean).length;
  const totalItems = SECTORES.reduce((acc, s) => acc + s.checklist.length, 0);
  const totalChecked = SECTORES.reduce((acc, s) => acc + completedCount(s.id, s.checklist.length), 0);
  const progreso = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: altoContraste ? "#000" : "#F4F6F9", minHeight: "100vh" }}>
      <div style={{ background: altoContraste ? "#000" : "#1A6FE8", padding: "20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Relevamiento CFP7</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={limpiar} style={{ background: "rgba(255,0,0,0.5)", border: "none", color: "#fff", borderRadius: 4, padding: "5px 10px", cursor: "pointer" }}>🗑️</button>
            <button onClick={() => setAltoContraste(!altoContraste)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 4, padding: "5px 10px", cursor: "pointer" }}>{altoContraste ? "☀️" : "🌑"}</button>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>Progreso: {progreso}% | Tiempo: {formatCron(cronSegundos)}</div>
      </div>

      <div style={{ padding: 20 }}>
        {activeTab === "sectores" && (
          <div>
            {SECTORES.map(s => (
              <div key={s.id} style={{ background: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 }}>
                <div onClick={() => setExpandedSector(expandedSector === s.id ? null : s.id)} style={{ fontWeight: 700, cursor: "pointer" }}>
                  {s.emoji} {s.titulo} ({completedCount(s.id, s.checklist.length)}/{s.checklist.length})
                </div>
                {expandedSector === s.id && (
                  <div style={{ marginTop: 10 }}>
                    {s.checklist.map((item, i) => (
                      <div key={i}><input type="checkbox" checked={!!checks[`${s.id}-${i}`]} onChange={() => setChecks({...checks, [`${s.id}-${i}`]: !checks[`${s.id}-${i}`]})} /> {item}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Relevamiento;