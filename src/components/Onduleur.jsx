export default function Onduleur({ onduleur }) {
  const statut    = onduleur.statut?.toLowerCase() ?? "";
  const pr        = onduleur.pr ?? 0;
  const horsLigne = statut === "hors_ligne";

  // Couleur basée sur le PR — conforme GPM Plus
  const getCouleur = () => {
    if (horsLigne)           return { bg: "#FCEBEB", text: "#A32D2D" }; // Rouge
    if (statut === "alerte") return { bg: "#FFF3CD", text: "#856404" }; // Orange
    return                          { bg: "#EAF3DE", text: "#3B6D11" }; // Vert clair
};

  const couleur = getCouleur();

  // Label statut
  const label = horsLigne           ? "Hors ligne"
            : statut === "alerte" ? "Alerte"
            :                       "OK";
  return (
    <div style={{
      ...s.row,
      borderLeft: `4px solid ${couleur.text}`,
      background: couleur.bg
    }}>
      <span style={{ ...s.name, color: couleur.text }}>
        {onduleur.id}
        
      </span>
      <span style={{ ...s.val, color: couleur.text }}>
        {horsLigne ? "—" : `${onduleur.puissance_kw} kW`}
      </span>
      <span style={{ ...s.pr, color: horsLigne ? "#aaa" : couleur.text }}>
        {horsLigne ? "—" : `PR ${pr}%`}
      </span>
      <span style={{
        ...s.pill,
        background: couleur.text,
        color: "#fff"
      }}>
        {label}
      </span>
    </div>
  );
}

const s = {
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    borderRadius: 8, padding: "9px 14px",
    fontSize: "0.92rem",
    border: "1px solid #e9ecef",
    marginBottom: 4,
    transition: "all 0.3s ease",
  },
  name: {
    fontWeight: 600,
    flex: 1,
    fontSize: "0.90rem",
  },
  ptr: {
    fontSize: "0.78rem",
    fontWeight: 400,
    opacity: 0.7,
  },
  val: {
    flex: 1,
    textAlign: "center",
    fontWeight: 700,
    fontSize: "0.90rem",
  },
  pr: {
    flex: 1,
    textAlign: "center",
    fontSize: "0.88rem",
    fontWeight: 600,
  },
  pill: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    minWidth: 76,
    textAlign: "center",
  },
};