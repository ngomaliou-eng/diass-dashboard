export default function Onduleur({ onduleur }) {
  const statut = onduleur.statut?.toLowerCase() ?? "";

  const ok        = statut === "ok";
  const alerte    = statut === "alerte";
  const horsLigne = statut === "hors_ligne";

  const pillStyle = ok
    ? { background: "#EAF3DE", color: "#3B6D11" }
    : alerte
    ? { background: "#FAEEDA", color: "#854F0B" }
    : { background: "#FCEBEB", color: "#A32D2D" };

  const label     = ok ? "OK" : alerte ? "Alerte" : "Hors ligne";
  const couleurVal = ok ? "#3B6D11" : alerte ? "#854F0B" : "#A32D2D";

  return (
    <div style={s.row}>
      <span style={s.name}>{onduleur.id}</span>
      <span style={{ ...s.val, color: couleurVal }}>{onduleur.puissance_kw} kW</span>
      <span style={s.temp}>
        {onduleur.temperature_c > 0 ? `${onduleur.temperature_c}°C` : "—"}
      </span>
      <span style={{ ...s.pill, ...pillStyle }}>{label}</span>
    </div>
  );
}

const s = {
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#f8f9fa", borderRadius: 8, padding: "9px 14px",
    fontSize: "0.92rem",      // ← .85rem → .92rem
    border: "1px solid #e9ecef",  // ← ajouté
  },
  name: {
    fontWeight: 600,           // ← 500 → 600
    flex: 1,
    color: "#1a1a2e",         // ← ajouté (plus foncé)
    fontSize: "0.90rem",      // ← ajouté
  },
  val: {
    flex: 1,
    textAlign: "center",
    fontWeight: 700,           // ← 600 → 700
    fontSize: "0.90rem",      // ← ajouté
  },
  temp: {
    flex: 1,
    textAlign: "center",
    color: "#444",             // ← #6c757d → #444 (plus foncé)
    fontSize: "0.88rem",      // ← .78rem → .88rem
    fontWeight: 500,          // ← ajouté
  },
  pill: {
    fontSize: "0.78rem",      // ← .7rem → .78rem
    fontWeight: 700,           // ← 600 → 700
    padding: "3px 10px",      // ← 2px 9px → 3px 10px
    borderRadius: 20,
    minWidth: 76,             // ← 72 → 76
    textAlign: "center",
  },
};