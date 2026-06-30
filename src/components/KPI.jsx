const ICONES = {
  "Puissance instantanée":  "⚡",
  "Irradiance solaire":      "☀️",
  "Énergie produite (jour)": "🔋",
  "Onduleurs actifs":        "🔧",
  "Ratio de performance":    "📊",
};

export default function KPI({ label, valeur, unite, couleur }) {
  const icone = ICONES[label] ?? "📌";

  return (
    <div style={s.card}>
      {/* Titre en haut — plus visible */}
      <p style={s.label}>{label}</p>

      {/* Icône */}
      <span style={s.icone}>{icone}</span>

      {/* Valeur + unité sur la même ligne */}
      <div style={s.valeurRow}>
        <span style={{ ...s.valeur, color: couleur }}>{valeur}</span>
        {unite && <span style={{ ...s.unite, color: couleur }}>{unite}</span>}
      </div>
    </div>
  );
}

const s = {
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #e9ecef",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,           // ← plus grand
    color: "#1a1a2e",       // ← plus foncé
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 700,        // ← plus gras
    margin: "0 0 4px",
  },
  icone: {
    fontSize: 22,
  },
  valeurRow: {
    display: "flex",
    alignItems: "baseline", // ← unité alignée avec la valeur
    gap: 6,
  },
  valeur: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.1,
  },
  unite: {
    fontSize: 14,           // ← plus grand
    fontWeight: 600,
    margin: 0,
  },
};