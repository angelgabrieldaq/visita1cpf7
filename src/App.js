import { useState, useEffect, useRef } from "react";

// ─── DATOS DEL RELEVAMIENTO ───────────────────────────────────────────────────
const SECTORES = [
  { id: "accesos", emoji: "🚪", color: "#1A6FE8", bg: "#EBF2FF", titulo: "Accesos al Edificio", desc: "Entradas principales y secundarias", checklist: ["Cantidad de accesos", "Acceso principal señalizado", "Sin desniveles", "Ancho puerta ≥ 90 cm", "Manija tipo palanca", "Timbre accesible", "Piso antideslizante", "Buena iluminación"], campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 2" }] },
  { id: "rampas", emoji: "♿", color: "#13B385", bg: "#E6F9F4", titulo: "Rampas", desc: "Rampas y circulación motriz", checklist: ["Ubicación", "Pendiente ≤ 8%", "Ancho ≥ 90 cm", "Pasamanos ambos lados", "Antideslizante", "Señalización en pavimento", "Espacio maniobra ≥ 150 cm", "Sin obstáculos"], campos: [{ idx: 0, label: "Ubicación", placeholder: "ej: sector norte" }] },
  { id: "escaleras", emoji: "🪜", color: "#E87013", bg: "#FFF3E8", titulo: "Escaleras", desc: "Escaleras internas y externas", checklist: ["Cantidad", "Pasamanos ambos lados", "Pasamanos continuo", "Primer/último escalón diferenciado", "Iluminación adecuada", "Antideslizante", "Señalética visible", "Contrahuella cerrada"], campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 3" }] },
  { id: "banios", emoji: "🚻", color: "#7A4FE5", bg: "#F2EEFF", titulo: "Baños", desc: "Sanitarios accesibles", checklist: ["Cantidad", "Baño adaptado disponible", "Señalética clara", "Puerta ≥ 80 cm", "Giro ≥ 150 cm", "Barras de apoyo", "Inodoro altura 45-50cm", "Lavabo espacio inferior", "Limpieza"], campos: [{ idx: 0, label: "Cantidad", placeholder: "ej: 4" }] },
  { id: "aulas", emoji: "🏫", color: "#0BA8BB", bg: "#E6F8FA", titulo: "Aulas", desc: "Espacios de formación", checklist: ["Número visible", "Señalética legible", "Acceso sin obstáculos", "Iluminación suficiente", "Espacio circulación ≥ 90 cm", "Visibilidad pizarrón", "Capacidad", "Ventilación"], campos: [{ idx: 6, label: "Capacidad", placeholder: "ej: 30" }] },
  { id: "circulacion", emoji: "🛤️", color: "#5A6470", bg: "#F0F2F4", titulo: "Pasillos", desc: "Corredores y espacios de tránsito", checklist: ["Ancho ≥ 120 cm", "Sin obstáculos", "Piso buen estado", "Señalética emergencia", "Salidas señalizadas", "Iluminación uniforme", "Patio accesible"], campos: [] },
  { id: "senaletica", emoji: "🗺️", color: "#D4A10A", bg: "#FFF9E6", titulo: "Señalética", desc: "Carteles y referencias", checklist: ["Cartelería legible", "Mapa visible", "Braille presente", "Pictogramas comprensibles", "Numeración visible", "Indicadores emergencia", "Lenguaje sencillo"], campos: [] },
  { id: "barreras", emoji: "⚠️", color: "#D93535", bg: "#FEECEC", titulo: "Barreras", desc: "Obstáculos e incidencias", severidad: true, checklist: ["Obstáculos", "Señalética dañada", "Puertas difíciles", "Pisos irregulares", "Falta iluminación", "Barreras comunicacionales", "Barreras actitudinales", "Otros"], campos: [] },
];

function Relevamiento() {
  const [checks, setChecks] = useState({});
  const [notas, setNotas] = useState({});
  const [general, setGeneral] = useState("");
  const [activeTab, setActiveTab] = useState("sectores");
  const [expandedSector, setExpandedSector] = useState(null);
  const [altoContraste, setAltoContraste] = useState(false);
  const [cronActivo, setCronActivo] = useState(false);
  const [cronSegundos, setCronSegundos] = useState(0);
  const cronRef = useRef(null);

  useEffect(() => {
    if (cronActivo) cronRef.current = setInterval(() => setCronSegundos(s => s + 1), 1000);
    else clearInterval(cronRef.current);
    return () => clearInterval(cronRef.current);
  }, [cronActivo]);

  // Carga inicial desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("cfp7-draft");
    if (data) {
      try {
        const p = JSON.parse(data);
        if(p.checks) setChecks(p.checks);
        if(p.notas) setNotas(p.notas);
        if(p.general) setGeneral(p.general);
        if(p.time) setCronSegundos(p.time);
      } catch(e) { console.error(e); }
    }
  }, []);

  // Guardado automático
  useEffect(() => {
    localStorage.setItem("cfp7-draft", JSON.stringify({checks, notas, general, time: cronSegundos}));
  }, [checks, notas, general, cronSegundos]);

  const limpiar = () => {
    if (window.confirm("¿Limpiar todo el relevamiento?")) {
      localStorage.removeItem("cfp7-draft");
      window.location.reload();
    }
  };

  const totalItems = SECTORES.reduce((acc, s) => acc + s.checklist.length, 0);
  const totalChecked = SECTORES.reduce((acc, s) => acc + Array.from({ length: s.checklist.length }, (_, i) => checks[`${s.id}-${i}`]).filter(Boolean).length, 0);
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
        <div style={{ marginTop: 10 }}>Progreso: {progreso}% | Tiempo: {Math.floor(cronSegundos/60)}m {cronSegundos%60}s</div>
      </div>

      <div style={{ padding: 20 }}>
        {activeTab === "sectores" && (
          <div>
            {SECTORES.map(s => (
              <div key={s.id} style={{ background: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 }}>
                <div onClick={() => setExpandedSector(expandedSector === s.id ? null : s.id)} style={{ fontWeight: 700, cursor: "pointer" }}>
                  {s.emoji} {s.titulo}
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